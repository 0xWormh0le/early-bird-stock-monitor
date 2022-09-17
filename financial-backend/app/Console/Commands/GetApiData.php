<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client;
use GuzzleHttp\Pool;
use GuzzleHttp\Promise;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Exception\RequestException;

use App\History;
use App\Latest;
use App\FloatSave;
use App\UpGappers;
use App\AfterHours;
use App\Ping;
use App\Module\Symbols\Nasdaq;
use App\Module\Symbols\Other as OtherSymbols;

class GetApiData extends Command
{
    use Nasdaq, OtherSymbols {
        Nasdaq::symbols insteadof OtherSymbols;
        Nasdaq::symbols as nasdaqSymbols;
        OtherSymbols::symbols as otherSymbols;
    }

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'apidata:save
                            {type=latest : \"latest\", \"float\", \"up-gappers\" or \"after-hours\"}
                            {--no-check-online : Doesn\'t check if there are any online users when it is set true}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get data via ebx cloud api';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    protected function requests($type, $client, $symbols, $token, $batchUrl)
    {
        foreach ($symbols as $chunk) {
            $query = [
                'types' => $type === 'float' ? 'stats' : 'quote',
                'symbols' => $chunk->implode(','),
                'token' => $token
            ];
            yield function () use ($client, $batchUrl, $query) {
                return $client->getAsync($batchUrl, ['query' => $query]);
            };
        }
    }

    protected function formatForDb($data)
    {
        return $data->map(function ($item) {
            return [
                'symbol' => $item['symbol'],
                'data' => json_encode($item['data']),
                'created_at' => now(),
                'updated_at' => now()
            ];
        })->all();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $symbols = array_merge($this->nasdaqSymbols(), $this->otherSymbols());
        $typeChoices = ['latest', 'float', 'up-gappers', 'after-hours'];
        $baseUrl = 'https://cloud.iexapis.com';
        $batchUrl = '/stable/stock/market/batch';
        $type = $this->argument('type');
        $noCheckOnline = $this->option('no-check-online');
        $token = config('app.iex_cloud_token');
        $top_change_count = config('app.top_change_count');

        if (!in_array($type, $typeChoices)) {
            $type = $this->choice('What is your api data for?', $typeChoices, 0);
        }

        if ($type === 'latest') {
            if (!$noCheckOnline && Ping::online()->count() === 0) {
                $this->info('There\'s no online users now.');
                return;
            }
        }
        $this->line('Making an API request now...');
        
        $symbols = collect($symbols)->chunk(99);
        $client = new Client(['base_uri' => $baseUrl]);
        $promises = [];

        $failed = 0;
        $data = [];

        $pool = new Pool($client, $this->requests($type, $client, $symbols, $token, $batchUrl), [
            'concurrency' => 25,
            'fulfilled' => function (Response $response, $index) use (&$data, $type) {
                $res = json_decode($response->getBody()->getContents(), true);
                foreach ($res as $symbol => $value) {
                    $data[] = [
                        'symbol' => $symbol,
                        'data' => $type === 'float' ? $value['stats'] : $value['quote']
                    ];
                }
            },
            'rejected' => function (RequestException $reason, $index) use (&$failed) {
                $failed++;
            }
        ]);

        $pool->promise()->wait();

        if ($failed) {
            $output = sprintf('%d out of %d requests failed', $failed, count($symbols));
            $this->line($output);
        }

        if ($type === 'float') {
            $data = collect($data)->chunk(100);
            FloatSave::truncate();
            foreach ($data as $chunk) {
                FloatSave::insert($this->formatForDb($chunk));
            }
        } else {
            $data = collect($data)->map(function ($item) {
                return $item['data'];
            })->sortByDesc('changePercent')->take($top_change_count);
            $float = FloatSave::whereIn('symbol', $data->pluck('symbol'))->get()->keyBy('symbol');
            $insert = $this->formatForDb($data->map(function ($item) use ($float) {
                $symbol = $item['symbol'];
                $fd = [ 'float' => 0, 'avg10Volume' => 0 ];

                if (isset($float[$symbol])) {
                    $fd = $float[$symbol]->data;
                }

                return [
                    'symbol' => $item['symbol'],
                    'data' => array_merge($item, $fd)
                ];
            }));
            
            switch ($type) {
                case 'latest':
                    Latest::truncate();
                    Latest::insert($insert);
                    break;
                case 'up-gappers':
                    UpGappers::truncate();
                    UpGappers::insert($insert);
                    break;
                case 'after-hours':
                    AfterHours::truncate();
                    AfterHours::insert($insert);
                    break;
            }
        }

        $this->info('Success!');
    }
}
