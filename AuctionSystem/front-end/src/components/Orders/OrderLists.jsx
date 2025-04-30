import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrders();
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId);
      fetchOrders(); // Refresh orders list
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please log in to view your orders.</p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <h2>No Orders Found</h2>
        <p>You haven't placed any orders yet.</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="orders-list">
      <h1>My Orders</h1>
      
      <div className="orders-container">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>Order #{order.id}</h3>
              <span className={`order-status ${getStatusClass(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            
            <div className="order-info">
              <p>Date: {formatDate(order.created_at)}</p>
              <p>Total: ${order.total}</p>
              <p>Items: {order.items.length}</p>
              <p>Payment Method: {order.payment_method.replace('_', ' ')}</p>
            </div>
            
            <div className="order-actions">
              <Link to={`/orders/${order.id}`} className="btn btn-secondary">
                View Details
              </Link>
              
              {(order.status === 'pending' || order.status === 'processing') && (
                <button 
                  onClick={() => handleCancelOrder(order.id)}
                  className="btn btn-danger"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList;