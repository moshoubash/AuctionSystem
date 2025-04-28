// src/components/layout/Header.jsx
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-black text-white text-center py-2 text-xs">
        Free shipping on orders over $50
      </div>
      
      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Logo */}
          <div className="text-2xl font-bold">
            <Link to="/">ShopStyle</Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/products" className="hover:underline">All Products</Link>
            <Link to="/products/category/1" className="hover:underline">Women</Link>
            <Link to="/products/category/2" className="hover:underline">Men</Link>
            <Link to="/products/category/3" className="hover:underline">Kids</Link>
            <Link to="/products/category/4" className="hover:underline">Accessories</Link>
          </nav>
          
          {/* Search, account, and cart */}
          <div className="flex items-center space-x-6">
            {/* Search form */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center border-b border-gray-300">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="py-1 focus:outline-none"
              />
              <button type="submit">
                <Search size={20} />
              </button>
            </form>
            
            {/* Account */}
            <div className="relative group">
              <Link to={currentUser ? "/profile" : "/login"} className="flex items-center">
                <User size={20} />
              </Link>
              
              {/* Account dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block z-10">
                {currentUser ? (
                  <div className="py-2">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">My Orders</Link>
                    <button 
                      onClick={logout} 
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="py-2">
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Sign In</Link>
                    <Link to="/register" className="block px-4 py-2 hover:bg-gray-100">Register</Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute z-20 w-full">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearch} className="flex items-center border-b border-gray-300 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="py-1 w-full focus:outline-none"
              />
              <button type="submit">
                <Search size={20} />
              </button>
            </form>
            
            <nav className="flex flex-col space-y-4">
              <Link to="/products" className="hover:underline" onClick={() => setIsMenuOpen(false)}>All Products</Link>
              <Link to="/products/category/1" className="hover:underline" onClick={() => setIsMenuOpen(false)}>Women</Link>
              <Link to="/products/category/2" className="hover:underline" onClick={() => setIsMenuOpen(false)}>Men</Link>
              <Link to="/products/category/3" className="hover:underline" onClick={() => setIsMenuOpen(false)}>Kids</Link>
              <Link to="/products/category/4" className="hover:underline" onClick={() => setIsMenuOpen(false)}>Accessories</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;