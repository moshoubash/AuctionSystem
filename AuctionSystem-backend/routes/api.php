<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UsersController;
use App\Http\Controllers\API\CategoriesController;
use App\Http\Controllers\API\ProductsController;
use App\Http\Controllers\API\CartItemsController;
use App\Http\Controllers\API\OrdersController;
use App\Http\Controllers\API\OrderItemsController;



Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Users endpoints
Route::apiResource('users', UsersController::class);

// Categories endpoints
Route::apiResource('categories', CategoriesController::class);

// Products endpoints
Route::apiResource('products', ProductsController::class);

// Cart Items endpoints
Route::apiResource('cart-items', CartItemsController::class);
Route::post('cart/clear', [CartItemsController::class, 'clearCart']);

// Orders endpoints
Route::apiResource('orders', OrdersController::class)->except(['update', 'destroy']);
Route::patch('orders/{id}/status', [OrdersController::class, 'updateStatus']);

// Order Items endpoints
Route::get('orders/{orderId}/items', [OrderItemsController::class, 'index']);
Route::get('order-items/{id}', [OrderItemsController::class, 'show']);
