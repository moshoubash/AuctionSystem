<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderItemsController extends Controller
{
    /**
     * Display a listing of the order items for a specific order.
     *
     * @param  int  $orderId
     * @return \Illuminate\Http\Response
     */
    public function index($orderId)
    {
        $order = Order::find($orderId);
        
        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Order not found'
            ], 404);
        }
        
        $orderItems = OrderItem::with('product')
            ->where('order_id', $orderId)
            ->get();
            
        return response()->json([
            'status' => true,
            'order_items' => $orderItems
        ]);
    }

    /**
     * Display the specified order item.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $orderItem = OrderItem::with('product')->find($id);
        
        if (!$orderItem) {
            return response()->json([
                'status' => false,
                'message' => 'Order item not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'order_item' => $orderItem
        ]);
    }
}