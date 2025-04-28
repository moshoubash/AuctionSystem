import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    payment_method: 'credit_card',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip: '',
    shipping_country: 'US',
  });

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create order
      const orderData = {
        user_id: user.id,
        total_price: cartTotal,
        payment_method: formData.payment_method,
        shipping_address: `${formData.shipping_address}, ${formData.shipping_city}, ${formData.shipping_state} ${formData.shipping_zip}, ${formData.shipping_country}`,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }))
      };

      const response = await axios.post('/api/orders', orderData);
      
      // Clear cart after successful order
      await axios.post('/api/cart/clear');
      clearCart();
      
      // Redirect to confirmation page
      navigate(`/order-confirmation/${response.data.id}`);
    } catch (err) {
      setError('There was a problem processing your order. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-light mb-8 uppercase tracking-wider">Checkout</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1 bg-gray-50 p-6">
          <h2 className="text-xl font-light mb-4 uppercase">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center">
                  <div className="w-16 h-20 bg-gray-200 mr-4">
                    {item.product.image_url && (
                      <img 
                        src={item.product.image_url} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <p>Subtotal</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p>Shipping</p>
              <p>Free</p>
            </div>
            <div className="flex justify-between font-medium text-lg mt-4 pt-4 border-t">
              <p>Total</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-light mb-6 uppercase">Shipping Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2">
                <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  id="shipping_address"
                  name="shipping_address"
                  required
                  value={formData.shipping_address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              
              <div>
                <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="shipping_city"
                  name="shipping_city"
                  required
                  value={formData.shipping_city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              
              <div>
                <label htmlFor="shipping_state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  id="shipping_state"
                  name="shipping_state"
                  required
                  value={formData.shipping_state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              
              <div>
                <label htmlFor="shipping_zip" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="shipping_zip"
                  name="shipping_zip"
                  required
                  value={formData.shipping_zip}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              
              <div>
                <label htmlFor="shipping_country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  id="shipping_country"
                  name="shipping_country"
                  required
                  value={formData.shipping_country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
            
            <h2 className="text-xl font-light mb-6 uppercase">Payment Method</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="credit_card"
                  name="payment_method"
                  value="credit_card"
                  checked={formData.payment_method === 'credit_card'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <label htmlFor="credit_card" className="ml-3 text-sm font-medium text-gray-700">
                  Credit Card
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paypal"
                  name="payment_method"
                  value="paypal"
                  checked={formData.payment_method === 'paypal'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <label htmlFor="paypal" className="ml-3 text-sm font-medium text-gray-700">
                  PayPal
                </label>
              </div>
            </div>

            <div className="text-right">
              <button
                type="submit"
                disabled={loading}
                className="inline-block px-8 py-3 bg-black text-white font-medium uppercase tracking-wider text-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;