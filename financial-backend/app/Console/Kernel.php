<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Artisan;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $tz = 'America/New_York';
        
        $schedule->command('apidata:save float')->dailyAt('04:00')->timezone($tz);
        // $schedule->command('apidata:save history')->dailyAt('04:00')->timezone($tz);
        $schedule->command('apidata:save up-gappers')->dailyAt('16:00')->timezone($tz);
        $schedule->command('apidata:save after-hours')->dailyAt('20:00')->timezone($tz);
        // for any online users
        $schedule->call(function () {
            $interval = config('app.api_interval');
            $counter = 0;
            while ($counter * $interval < 5 * 60) {
                Artisan::call('apidata:save latest');
                $counter++;
                sleep($interval);
            }
        })->name('latest_data')->withoutOverlapping()->everyFiveMinutes()->timezone($tz)->between('04:00', '20:00');
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
