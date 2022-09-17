<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ping extends Model
{
    protected $fillable = ['user_id', 'updated_at'];
    
    public function scopeOnline($query)
    {
        $ping_interval = config('app.ping_interval');
        return $query->where('updated_at', '>=', now()->subSeconds($ping_interval));
    }
}
