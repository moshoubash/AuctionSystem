import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../../services/api";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productService.getProduct(id);
      setProduct(response.data);
    } catch (err) {
      console.error("Error fetching product:", err);
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock_quantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (isAuthenticated && product) {
      addToCart(product.id, quantity);
    } else if (!isAuthenticated) {
      navigate("/login");
    }
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-details">
      <div className="product-details-container">
        <div className="product-image-container">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="product-image"
            />
          ) : (
            <div className="product-no-image">No image available</div>
          )}
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-price">${product.price}</p>

          {product.category && (
            <p className="product-category">
              Category: {product.category.name}
            </p>
          )}

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || "No description available."}</p>
          </div>

          <div className="product-stock">
            {product.stock_quantity > 0 ? (
              <p className="in-stock">
                In Stock: {product.stock_quantity} available
              </p>
            ) : (
              <p className="out-of-stock">Out of Stock</p>
            )}
          </div>

          {product.stock_quantity > 0 && (
            <div className="product-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.stock_quantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                disabled={!isAuthenticated}
              >
                Add to Cart
              </button>

              {!isAuthenticated && (
                <p className="login-prompt">
                  Please log in to add items to your cart
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
