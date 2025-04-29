// src/pages/Cart.jsx
import React,{ useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { Trash2, Plus, Minus } from 'lucide-react';

const Cart = () => {
  const { cart, loading: cartLoading, error: cartError, updateCartItem, removeCartItem } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (cartLoading) return;
      
      setLoading(true);
      setError(null);
      
      if (cart.length === 0) {
        setCartProducts([]);
        setLoading(false);
        return;
      }
      
      try {
        // For guests, we only have product IDs in the cart, so we need to fetch product details
        if (!currentUser) {
          const productIds = cart.map(item => item.product_id);
          const promises = productIds.map(id => api.get(`/products/${id}`));
          
          const responses = await Promise.all(promises);
          const products = responses.map(response => response.data);
          
          // Combine product details with cart quantities
          const cartWithDetails = cart.map(item => {
            const product = products.find(p => p.id === item.product_id);
            return {
              ...item,
              product,
              product_id: item.product_id,
              quantity: item.quantity
            };
          });
          
          setCartProducts(cartWithDetails);
        } else {
          // For logged in users, cart items already have product details
          setCartProducts(cart);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart products:', err);
        setError('Failed to load cart items. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchCartProducts();
  }, [cart, cartLoading, currentUser]);

  const handleQuantityChange = async (itemId, productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    
    setUpdating(itemId || productId);
    await updateCartItem(itemId || productId, newQuantity);
    setUpdating(null);
  };

  const handleRemoveItem = async (itemId, productId) => {
    setUpdating(itemId || productId);
    await removeCartItem(itemId || productId);
    setUpdating(null);
  };

  const calculateSubtotal = () => {
    return cartProducts.reduce((total, item) => {
      const price = item.product ? item.product.price : item.price;
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const shipping = subtotal >= 50 ? 0 : 5.99;
    return (subtotal + shipping).toFixed(2);
  };

  const handleCheckout = () => {
    if (!currentUser) {
      // Redirect to login with return URL
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (cartLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Shopping Bag</h1>
        <div className="flex justify-center items-center h-64">
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartError || error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Shopping Bag</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{cartError || error}</p>
        </div>
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Shopping Bag</h1>
        <div className="flex flex-col justify-center items-center h-64">
          <p className="mb-6">Your shopping bag is empty.</p>
          <Link 
            to="/products" 
            className="bg-black text-white px-6 py-3"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Bag</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="col-span-2">
          <div className="border-b border-gray-200 pb-2 mb-4 hidden md:grid md:grid-cols-12 gap-4">
            <div className="col-span-6">
              <span className="font-medium">Product</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="font-medium">Price</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="font-medium">Quantity</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="font-medium">Total</span>
            </div>
          </div>
          
          {cartProducts.map(item => {
            const product = item.product || item;
            const itemId = item.id;
            const productId = item.product_id || product.id;
            const isUpdating = updating === itemId || updating === productId;
            
            return (
              <div key={itemId || productId} className="border-b border-gray-200 py-4">
                <div className="md:grid md:grid-cols-12 gap-4 items-center">
                  {/* Product info */}
                  <div className="col-span-6 flex items-center">
                    <div className="w-20 h-24 bg-gray-100 mr-4">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img 
                          src="/api/placeholder/80/96" 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">
                        <Link to={`/products/${productId}`} className="hover:underline">
                          {product.name}
                        </Link>
                      </h3>
                      {/* Remove button for mobile */}
                      <button 
                        onClick={() => handleRemoveItem(itemId, productId)}
                        disabled={isUpdating}
                        className="text-gray-500 text-sm flex items-center md:hidden mt-2 hover:text-black"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="col-span-2 text-center mt-4 md:mt-0">
                    <span className="md:hidden font-medium mr-2">Price:</span>
                    ${product.price}
                  </div>
                  
                  {/* Quantity */}
                  <div className="col-span-2 text-center mt-4 md:mt-0">
                    <div className="flex items-center justify-center">
                      <button 
                        onClick={() => handleQuantityChange(itemId, productId, item.quantity, -1)}
                        disabled={isUpdating || item.quantity <= 1}
                        className="px-2 py-1 border border-gray-300"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-1 border-t border-b border-gray-300">
                        {isUpdating ? '...' : item.quantity}
                      </span>
                      <button 
                        onClick={() => handleQuantityChange(itemId, productId, item.quantity, 1)}
                        disabled={isUpdating}
                        className="px-2 py-1 border border-gray-300"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="col-span-2 text-right mt-4 md:mt-0 flex items-center justify-between md:justify-end">
                    <span className="md:hidden font-medium mr-2">Total:</span>
                    <span>${(product.price * item.quantity).toFixed(2)}</span>
                    
                    {/* Remove button for desktop */}
                    <button 
                      onClick={() => handleRemoveItem(itemId, productId)}
                      disabled={isUpdating}
                      className="text-gray-500 ml-6 hidden md:block hover:text-black"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Order summary */}
        <div className="col-span-1">
          <div className="bg-gray-50 p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateSubtotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{parseFloat(calculateSubtotal()) >= 50 ? 'FREE' : '$5.99'}</span>
              </div>
              <div className="border-t border-gray-300 pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              className="bg-black text-white w-full py-3 mb-4"
            >
              CHECKOUT
            </button>
            
            <Link
              to="/products"
              className="block border border-black text-center w-full py-3"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;