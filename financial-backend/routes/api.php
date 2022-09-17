<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/auth/register', 'AuthController@register');

Route::post('/auth/login', 'AuthController@login');

Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/auth/logout', 'AuthController@logout');

    Route::get('/stock/latest', 'HomeController@latest');

    Route::get('/stock/up-gappers', 'HomeController@upGappers');

    Route::get('/stock/after-hours', 'HomeController@afterHours');

    Route::post('/ping', 'PingController@ping');
});

Route::get('/test', function () {
});
