import { createContext, useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import api from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchCart();
    } else {
      // Use local storage cart for guests
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(localCart);
    }
  }, [currentUser]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await api.get("/cart-items");
      setCart(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError("Failed to load your cart");
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setError(null);

    if (currentUser) {
      // Logged in user - use API
      try {
        const response = await api.post("/cart-items", {
          product_id: productId,
          quantity,
        });
        setCart((prevCart) => {
          // Check if product already exists in cart
          const existingItem = prevCart.find(
            (item) => item.product_id === productId
          );
          if (existingItem) {
            // Update existing item quantity
            return prevCart.map((item) =>
              item.product_id === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            // Add new item
            return [...prevCart, response.data];
          }
        });
        return true;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to add item to cart");
        return false;
      }
    } else {
      // Guest user - use localStorage
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItemIndex = localCart.findIndex(
        (item) => item.product_id === productId
      );

      if (existingItemIndex >= 0) {
        localCart[existingItemIndex].quantity += quantity;
      } else {
        localCart.push({ product_id: productId, quantity });
      }

      localStorage.setItem("cart", JSON.stringify(localCart));
      setCart(localCart);
      return true;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    setError(null);

    if (currentUser) {
      // Logged in user - use API
      try {
        await api.put(`/cart-items/${itemId}`, { quantity });
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          )
        );
        return true;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to update cart item");
        return false;
      }
    } else {
      // Guest user - use localStorage
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = localCart.map((item) =>
        item.id === itemId || item.product_id === itemId
          ? { ...item, quantity }
          : item
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      return true;
    }
  };

  const removeCartItem = async (itemId) => {
    setError(null);

    if (currentUser) {
      // Logged in user - use API
      try {
        await api.delete(`/cart-items/${itemId}`);
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
        return true;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to remove cart item");
        return false;
      }
    } else {
      // Guest user - use localStorage
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = localCart.filter(
        (item) => item.id !== itemId && item.product_id !== itemId
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      return true;
    }
  };

  const clearCart = async () => {
    setError(null);

    if (currentUser) {
      // Logged in user - use API
      try {
        await api.post("/cart/clear");
        setCart([]);
        return true;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to clear cart");
        return false;
      }
    } else {
      // Guest user - use localStorage
      localStorage.removeItem("cart");
      setCart([]);
      return true;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};