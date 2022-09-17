<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Ping;

class PingController extends Controller
{
    public function ping(Request $request)
    {
        Ping::updateOrCreate(
            ['user_id' => auth()->user()->id],
            ['updated_at' => now()]
        );
        return 'pong';
    }
}
