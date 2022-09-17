<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AfterHours extends Model
{
    protected $casts = [
        'data' => 'array'
    ];
}
