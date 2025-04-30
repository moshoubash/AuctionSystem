import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], total: 0 });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartService.getCart();
      setCart(response.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      await cartService.addToCart(productId, quantity);
      fetchCart();
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    setLoading(true);
    try {
      await cartService.updateCartItem(itemId, quantity);
      fetchCart();
    } catch (err) {
      console.error('Error updating cart item:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    try {
      await cartService.removeFromCart(itemId);
      fetchCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await cartService.clearCart();
      setCart({ items: [], total: 0 });
    } catch (err) {
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    itemCount: cart.items.reduce((acc, item) => acc + item.quantity, 0)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};