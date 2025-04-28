<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    //
    protected $fillable = [
        'user_id',
        'total_price',
        'status',
        'payment_method',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    
    public function products()
    {
        return $this->hasManyThrough(Product::class, OrderItem::class);
    }
}
