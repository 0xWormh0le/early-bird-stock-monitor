<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FloatSave extends Model
{
    protected $table = 'floats';

    protected $casts = [
        'data' => 'array'
    ];
}
