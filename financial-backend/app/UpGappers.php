<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UpGappers extends Model
{
    protected $casts = [
        'data' => 'array'
    ];
}
