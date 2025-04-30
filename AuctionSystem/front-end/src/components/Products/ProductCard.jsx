import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = () => {
    if (isAuthenticated) {
      addToCart(product.id, 1);
    }
  };

  return (
    <div className="product-card">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="product-image"
        />
      )}

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-price">${product.price}</p>
        <p className="product-category">
          {product.category?.name || "Uncategorized"}
        </p>
      </div>

      <div className="product-actions">
        <Link to={`/products/${product.id}`} className="btn btn-secondary">
          View Details
        </Link>
        {product.stock_quantity > 0 ? (
          <button
            onClick={handleAddToCart}
            className="btn btn-primary"
            disabled={!isAuthenticated}
          >
            Add to Cart
          </button>
        ) : (
          <button className="btn btn-disabled" disabled>
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
