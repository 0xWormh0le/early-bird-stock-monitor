<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Latest extends Model
{
    protected $fillable = ['symbol', 'data'];

    protected $casts = [
        'data' => 'array'
    ];
}
