<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $orders = $request->user()->orders()->with('orderItems.product')->latest()->get();

        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'payment_method' => 'required|string|max:50',
        ]);

        // Get cart items
        $cartItems = $request->user()->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        // Calculate total price
        $totalPrice = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        DB::beginTransaction();

        try {
            // Create order
            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_price' => $totalPrice,
                'status' => 'pending',
                'payment_method' => $request->payment_method,
            ]);

            // Create order items and update stock
            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product;

                // Check stock
                if ($product->stock_quantity < $cartItem->quantity) {
                    throw new \Exception("Not enough stock for product: {$product->name}");
                }

                // Create order item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $product->price,
                ]);

                // Update product stock
                $product->stock_quantity -= $cartItem->quantity;
                $product->save();
            }

            // Clear cart
            $request->user()->cartItems()->delete();

            DB::commit();

            return response()->json($order->load('orderItems.product'), 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Order $order)
    {
        // Ensure the order belongs to the authenticated user
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($order->load('orderItems.product'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        // Check if the user is authorized (Admin role would be implemented here)
        // This is a simplified version without role checks

        $request->validate([
            'status' => 'required|in:pending,paid,shipped,delivered,canceled',
        ]);

        $order->update([
            'status' => $request->status,
        ]);

        return response()->json($order);
    }

    /**
     * Cancel an order.
     */
    public function cancel(Request $request, Order $order)
    {
        // Ensure the order belongs to the authenticated user
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Only pending orders can be canceled
        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Only pending orders can be canceled'], 422);
        }

        DB::beginTransaction();

        try {
            // Update order status
            $order->status = 'canceled';
            $order->save();

            // Restore product stock
            foreach ($order->orderItems as $orderItem) {
                $product = $orderItem->product;
                $product->stock_quantity += $orderItem->quantity;
                $product->save();
            }

            DB::commit();

            return response()->json(['message' => 'Order canceled successfully']);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
