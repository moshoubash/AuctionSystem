// pages/OrderDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Fetch order details
        const orderResponse = await axios.get(`/api/orders/${id}`);
        setOrder(orderResponse.data);
        
        // Fetch order items
        const itemsResponse = await axios.get(`/api/orders/${id}/items`);
        setOrderItems(itemsResponse.data);
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // Helper function to format status class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <p className="text-lg">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <p className="text-lg text-red-600">{error || 'Order not found'}</p>
        <button 
          onClick={() => navigate('/orders')}
          className="mt-4 inline-flex items-center text-black hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link 
        to="/orders" 
        className="inline-flex items-center mb-6 text-black hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Orders
      </Link>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light uppercase tracking-wider">Order #{id}</h1>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadgeClass(order.status)}`}>
          {order.status}
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Information */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-50 p-6">
            <h2 className="text-xl font-light mb-4 uppercase">Order Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-gray-600">Order Date:</p>
                <p>{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Payment Method:</p>
                <p className="capitalize">{order.payment_method?.replace('_', ' ') || 'N/A'}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Total Amount:</p>
                <p className="font-medium">${parseFloat(order.total_price).toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6">
            <h2 className="text-xl font-light mb-4 uppercase">Shipping Address</h2>
            <p className="text-gray-600">
              {/* Assuming shipping address is part of order data, replace with actual data structure */}
              {order.shipping_address || 'Shipping address not available'}
            </p>
          </div>
        </div>
        
        {/* Order Items */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-light mb-4 uppercase">Items</h2>
          
          {orderItems.length === 0 ? (
            <p className="text-gray-600">No items found for this order</p>
          ) : (
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex border-b pb-4">
                  <div className="w-24 h-32 bg-gray-200 flex-shrink-0">
                    {item.product && item.product.image_url && (
                      <img 
                        src={item.product.image_url} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium">
                      {item.product?.name || 'Product name not available'}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">Quantity: {item.quantity}</p>
                    {item.product?.description && (
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {item.product.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="ml-4 text-right">
                    <p className="font-medium">
                      ${parseFloat(item.price).toFixed(2)}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t mt-6">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;