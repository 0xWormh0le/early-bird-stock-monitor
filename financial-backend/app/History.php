<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    protected $fillable = ['data', 'label'];

    protected $casts = [
        'data' => 'array'
    ];
}
