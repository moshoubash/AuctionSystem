<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $cartItems = $request->user()->cartItems()->with('product')->get();

        $total = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        return response()->json([
            'items' => $cartItems,
            'total' => $total
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Check if product has enough stock
        $product = Product::findOrFail($request->product_id);
        if ($product->stock_quantity < $request->quantity) {
            return response()->json([
                'message' => 'Not enough stock available'
            ], 422);
        }

        // Check if item already exists in cart
        $cartItem = $request->user()->cartItems()
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            // Update quantity if already in cart
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            // Create new cart item
            $cartItem = CartItem::create([
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json($cartItem->load('product'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, CartItem $cartItem)
    {
        // Ensure the cart item belongs to the authenticated user
        if ($cartItem->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($cartItem->load('product'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CartItem $cartItem)
    {
        // Ensure the cart item belongs to the authenticated user
        if ($cartItem->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Check if product has enough stock
        $product = Product::findOrFail($cartItem->product_id);
        if ($product->stock_quantity < $request->quantity) {
            return response()->json([
                'message' => 'Not enough stock available'
            ], 422);
        }

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        return response()->json($cartItem->load('product'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, CartItem $cartItem)
    {
        // Ensure the cart item belongs to the authenticated user
        if ($cartItem->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cartItem->delete();

        return response()->json(null, 204);
    }

    /**
     * Clear all cart items for the authenticated user.
     */
    public function clear(Request $request)
    {
        $request->user()->cartItems()->delete();

        return response()->json(['message' => 'Cart cleared successfully']);
    }
}
