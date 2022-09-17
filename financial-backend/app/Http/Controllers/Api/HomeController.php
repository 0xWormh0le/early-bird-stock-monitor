<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Latest;
use App\UpGappers;
use App\AfterHours;
use App\Ping;
use Artisan;
use Carbon\Carbon;

class HomeController extends Controller
{
    public function latest(Request $request)
    {
        $tz = 'America/New_York';
        $now = now($tz);
        $update_begin = Carbon::parse('today 4am', $tz);
        $update_end = Carbon::parse('today 8pm', $tz);
        
        if (!$now->between($update_begin, $update_end)) {
            return $this->afterHours($request);
        }

        $data = Latest::all();
        $ping_interval = config('app.ping_interval');
        
        $updated_at = NULL;
        $first = $data->first();

        if ($first) {
            $updated_at = $first->updated_at;
        }
        
        if (empty($updated_at) || $updated_at < now()->subSeconds($ping_interval)) {
            Artisan::call('apidata:save latest --no-check-online');
            $data = Latest::all()->pluck('data');
        } else {
            $data = $data->pluck('data');
        }

        $market_begin = Carbon::parse('today 9:30am', $tz);
        $market_end = Carbon::parse('today 4pm', $tz);
        $market_hours = $now->between($market_begin, $market_end);
        $result = $this->makeResponseArray($data, $market_hours);

        return response()->json($result);
    }

    public function upGappers(Request $request)
    {
        $data = UpGappers::all()->pluck('data');
        $result = $this->makeResponseArray($data);

        return response()->json($result);
    }

    public function afterHours(Request $request)
    {
        $data = AfterHours::all()->pluck('data');
        $result = $this->makeResponseArray($data, FALSE);
        
        return response()->json($result);
    }

    protected function makeResponseArray($data, $latest_or_extended = TRUE)
    {
        return $data->map(function ($item) use ($latest_or_extended) {
            return [
                'symbol' => $item['symbol'],
                'company' => $item['companyName'],
                'price' => $item[$latest_or_extended ? 'latestPrice' : 'extendedPrice'],
                'volume' => $item['latestVolume'],
                'marketCap' => $item['marketCap'],
                'changePrice' => $item['change'],
                'changePercent' => $item['changePercent'],
                'avgVol5d' => $item['avg10Volume'],
                'float' => $item['float']
            ];
        });
    }
}
