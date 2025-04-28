<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'stock_quantity',
        'image_url',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
