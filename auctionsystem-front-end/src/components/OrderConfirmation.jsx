import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle } from "lucide-react";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderResponse = await axios.get(`/api/orders/${orderId}`);
        const orderItemsResponse = await axios.get(
          `/api/orders/${orderId}/items`
        );

        // Combine order with its items
        setOrder({
          ...orderResponse.data,
          items: orderItemsResponse.data,
        });
      } catch (err) {
        setError("Failed to load order information");
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-lg">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-red-600">
          {error || "Order not found. Please try again."}
        </p>
        <Link
          to="/orders"
          className="mt-4 inline-block underline hover:no-underline"
        >
          Go to your orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-light mb-2 uppercase tracking-wider">
          Thank You!
        </h1>
        <p className="text-lg text-gray-600">
          Your order has been placed successfully
        </p>
        <p className="text-sm mt-2">Order #{order.id}</p>
      </div>

      <div className="bg-gray-50 p-6 mb-8">
        <h2 className="text-xl font-light mb-4 uppercase">Order Summary</h2>

        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between mb-2">
            <p className="text-gray-600">Order Date:</p>
            <p>{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-gray-600">Order Status:</p>
            <p className="capitalize">{order.status}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Payment Method:</p>
            <p className="capitalize">
              {order.payment_method.replace("_", " ")}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-3"
            >
              <div className="flex items-center">
                <div className="w-16 h-20 bg-gray-200 mr-4">
                  {item.product && item.product.image_url && (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {item.product?.name || "Product"}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">
                ${parseFloat(item.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <p>Subtotal</p>
            <p>${parseFloat(order.total_price).toFixed(2)}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p>Shipping</p>
            <p>Free</p>
          </div>
          <div className="flex justify-between font-medium text-lg mt-4 pt-4 border-t">
            <p>Total</p>
            <p>${parseFloat(order.total_price).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-4">
        <Link
          to="/products"
          className="inline-block px-6 py-3 border border-black text-black font-medium uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          to="/orders"
          className="inline-block px-6 py-3 bg-black text-white font-medium uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors"
        >
          View Your Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
