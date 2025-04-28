import React, { useState, useEffect } from "react";
import axios from "axios";

const Cart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const API_BASE_URL = "http://localhost:8000/api";

  useEffect(() => {
    if (!userId) return;

    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/cart-items`, {
          params: { user_id: userId },
        });

        if (response.data.status) {
          setCartItems(response.data.cart_items);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch cart items. Please try again later.");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await axios.put(`${API_BASE_URL}/cart-items/${id}`, {
        quantity: newQuantity,
      });

      if (response.data.status) {
        setCartItems(
          cartItems.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (err) {
      setError("Failed to update quantity. Please try again.");
    }
  };

  const removeItem = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/cart-items/${id}`);

      if (response.data.status) {
        setCartItems(cartItems.filter((item) => item.id !== id));
      }
    } catch (err) {
      setError("Failed to remove item. Please try again.");
    }
  };

  const clearCart = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/cart/clear`, {
        user_id: userId,
      });

      if (response.data.status) {
        setCartItems([]);
      }
    } catch (err) {
      setError("Failed to clear cart. Please try again.");
    }
  };

  const checkout = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, {
        user_id: userId,
        payment_method: "credit_card", // This would typically come from a form
        use_cart: true,
      });

      if (response.data.status) {
        setCartItems([]);
        setOrderSuccess(true);
        setTimeout(() => setOrderSuccess(false), 5000); // Hide success message after 5 seconds
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to checkout. Please try again."
      );
    }
  };

  // Calculate total price
  const total = cartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  if (!userId) {
    return (
      <div className="text-center my-8">Please log in to view your cart.</div>
    );
  }

  if (loading) {
    return <div className="text-center my-8">Loading cart...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {orderSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Order placed successfully! Thank you for your purchase.
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-500">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-4 text-center">Price</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        {item.product.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover mr-4"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 mr-4 flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              No image
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      ${item.product.price}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center">
                        <button
                          className="bg-gray-200 px-2 py-1 rounded-l"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          className="bg-gray-200 px-2 py-1 rounded-r"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="3" className="py-4 px-4 text-right font-bold">
                    Total:
                  </td>
                  <td className="py-4 px-4 text-right font-bold">
                    ${total.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex justify-between">
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
              onClick={clearCart}
            >
              Clear Cart
            </button>

            <button
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded"
              onClick={checkout}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
