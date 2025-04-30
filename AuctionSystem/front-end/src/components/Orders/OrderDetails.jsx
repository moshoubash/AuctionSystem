import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { orderService } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrder();
    } else {
      navigate("/login");
    }
  }, [id, isAuthenticated]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrder(id);
      setOrder(response.data);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError(
        "Error loading order details. The order may not exist or you may not have permission to view it."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await orderService.cancelOrder(id);
      fetchOrder(); // Refresh order details
    } catch (err) {
      console.error("Error cancelling order:", err);
      setError("Failed to cancel the order. Please try again.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "processing":
        return "status-processing";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/orders" className="btn btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return <div className="loading">Order not found</div>;
  }

  return (
    <div className="order-details">
      <div className="order-details-header">
        <h1>Order #{order.id}</h1>
        <span className={`order-status ${getStatusClass(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="order-info-section">
        <h2>Order Information</h2>
        <div className="order-info-grid">
          <div className="order-info-item">
            <span className="label">Order Date:</span>
            <span>{formatDate(order.created_at)}</span>
          </div>
          <div className="order-info-item">
            <span className="label">Total:</span>
            <span>${order.total}</span>
          </div>
          <div className="order-info-item">
            <span className="label">Payment Method:</span>
            <span>{order.payment_method.replace("_", " ")}</span>
          </div>
          {order.updated_at !== order.created_at && (
            <div className="order-info-item">
              <span className="label">Last Updated:</span>
              <span>{formatDate(order.updated_at)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="order-items-section">
        <h2>Order Items</h2>
        <div className="order-items-list">
          {order.items.map((item) => (
            <div key={item.id} className="order-item">
              <div className="item-image">
                <img
                  src={item.product.image_url || "/placeholder.png"}
                  alt={item.product.name}
                />
              </div>
              <div className="item-details">
                <h3>{item.product.name}</h3>
                <p className="item-price">
                  ${item.price} × {item.quantity}
                </p>
                <p className="item-subtotal">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-summary-section">
        <h2>Order Summary</h2>
        <div className="order-summary">
          <div className="summary-item">
            <span>Subtotal:</span>
            <span>${order.total}</span>
          </div>
          <div className="summary-item">
            <span>Shipping:</span>
            <span>$0.00</span>
          </div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>${order.total}</span>
          </div>
        </div>
      </div>

      <div className="order-actions">
        <Link to="/orders" className="btn btn-secondary">
          Back to Orders
        </Link>

        {(order.status === "pending" || order.status === "processing") && (
          <button onClick={handleCancelOrder} className="btn btn-danger">
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
