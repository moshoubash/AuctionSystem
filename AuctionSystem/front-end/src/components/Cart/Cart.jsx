import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { orderService } from "../../services/api";

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart, clearCart } =
    useCart();
  const [paymentMethod, setPaymentMethod] = React.useState("credit_card");
  const [orderProcessing, setOrderProcessing] = React.useState(false);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) return;
    updateCartItem(itemId, quantity);
  };

  const handleCheckout = async () => {
    setOrderProcessing(true);
    setError(null);

    try {
      const response = await orderService.createOrder({
        payment_method: paymentMethod,
      });
      navigate(`/orders/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Error processing your order");
    } finally {
      setOrderProcessing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart to see them here.</p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <img
                src={item.product.image_url || "/placeholder.png"}
                alt={item.product.name}
                className="cart-item-image"
              />

              <div className="cart-item-details">
                <h3>{item.product.name}</h3>
                <p className="cart-item-price">${item.product.price}</p>
              </div>
            </div>

            <div className="cart-item-actions">
              <div className="quantity-controls">
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                  disabled={item.quantity >= item.product.stock_quantity}
                >
                  +
                </button>
              </div>

              <p className="cart-item-subtotal">
                ${(item.quantity * item.product.price).toFixed(2)}
              </p>

              <button
                onClick={() => removeFromCart(item.id)}
                className="btn btn-danger"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <h3>Total: ${cart.total}</h3>
        </div>

        <div className="payment-method">
          <h3>Payment Method</h3>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>

        <div className="cart-actions">
          <button onClick={clearCart} className="btn btn-secondary">
            Clear Cart
          </button>

          <button
            onClick={handleCheckout}
            className="btn btn-primary"
            disabled={orderProcessing}
          >
            {orderProcessing ? "Processing..." : "Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
