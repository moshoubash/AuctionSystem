<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrdersController extends Controller
{
    /**
     * Display a listing of the orders.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // Optional user_id filter
        if ($request->has('user_id')) {
            $orders = Order::with('orderItems.product')->where('user_id', $request->user_id)->get();
        } else {
            $orders = Order::with('orderItems.product')->get();
        }

        return response()->json([
            'status' => true,
            'orders' => $orders
        ]);
    }

    /**
     * Store a newly created order in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'payment_method' => 'required|string|max:50',
            'use_cart' => 'sometimes|boolean',
            'items' => 'required_if:use_cart,false|array',
            'items.*.product_id' => 'required_if:use_cart,false|exists:products,id',
            'items.*.quantity' => 'required_if:use_cart,false|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Start a database transaction
        DB::beginTransaction();

        try {
            $totalPrice = 0;
            $orderItems = [];

            // Get items either from cart or from request
            if ($request->use_cart) {
                $cartItems = CartItem::with('product')->where('user_id', $request->user_id)->get();

                if ($cartItems->isEmpty()) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Cart is empty'
                    ], 400);
                }

                foreach ($cartItems as $cartItem) {
                    // Check stock
                    if ($cartItem->product->stock_quantity < $cartItem->quantity) {
                        throw new \Exception("Not enough stock for {$cartItem->product->name}");
                    }

                    $itemTotal = $cartItem->product->price * $cartItem->quantity;
                    $totalPrice += $itemTotal;

                    $orderItems[] = [
                        'product_id' => $cartItem->product_id,
                        'quantity' => $cartItem->quantity,
                        'price' => $cartItem->product->price,
                    ];

                    // Update product stock
                    $product = $cartItem->product;
                    $product->stock_quantity -= $cartItem->quantity;
                    $product->save();
                }

                // Clear the cart after order creation
                CartItem::where('user_id', $request->user_id)->delete();
            } else {
                foreach ($request->items as $item) {
                    $product = Product::find($item['product_id']);

                    // Check stock
                    if ($product->stock_quantity < $item['quantity']) {
                        throw new \Exception("Not enough stock for {$product->name}");
                    }

                    $itemTotal = $product->price * $item['quantity'];
                    $totalPrice += $itemTotal;

                    $orderItems[] = [
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'price' => $product->price,
                    ];

                    // Update product stock
                    $product->stock_quantity -= $item['quantity'];
                    $product->save();
                }
            }

            // Create the order
            $order = Order::create([
                'user_id' => $request->user_id,
                'total_price' => $totalPrice,
                'status' => 'pending',
                'payment_method' => $request->payment_method,
            ]);

            // Create order items
            foreach ($orderItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            DB::commit();

            $order->load('orderItems.product');

            return response()->json([
                'status' => true,
                'message' => 'Order created successfully',
                'order' => $order
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Display the specified order.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $order = Order::with('orderItems.product')->find($id);

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'order' => $order
        ]);
    }

    /**
     * Update the order status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateStatus(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,paid,shipped,delivered,canceled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // If order is being cancelled, restore stock
        if ($request->status === 'canceled' && $order->status !== 'canceled') {
            DB::beginTransaction();

            try {
                $orderItems = OrderItem::where('order_id', $order->id)->get();

                foreach ($orderItems as $item) {
                    $product = Product::find($item->product_id);
                    $product->stock_quantity += $item->quantity;
                    $product->save();
                }

                $order->status = 'canceled';
                $order->save();

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();

                return response()->json([
                    'status' => false,
                    'message' => $e->getMessage()
                ], 400);
            }
        } else {
            $order->status = $request->status;
            $order->save();
        }

        return response()->json([
            'status' => true,
            'message' => 'Order status updated successfully',
            'order' => $order
        ]);
    }
}
