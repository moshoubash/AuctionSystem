// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Shop section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/products/category/1" className="text-gray-600 hover:text-black">Women</Link></li>
              <li><Link to="/products/category/2" className="text-gray-600 hover:text-black">Men</Link></li>
              <li><Link to="/products/category/3" className="text-gray-600 hover:text-black">Kids</Link></li>
              <li><Link to="/products/category/4" className="text-gray-600 hover:text-black">Accessories</Link></li>
              <li><Link to="/products" className="text-gray-600 hover:text-black">New Arrivals</Link></li>
            </ul>
          </div>
          
          {/* Corporate info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Corporate Info</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-black">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-black">Careers</Link></li>
              <li><Link to="/sustainability" className="text-gray-600 hover:text-black">Sustainability</Link></li>
              <li><Link to="/press" className="text-gray-600 hover:text-black">Press</Link></li>
              <li><Link to="/investor-relations" className="text-gray-600 hover:text-black">Investor Relations</Link></li>
            </ul>
          </div>
          
          {/* Help */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link to="/customer-service" className="text-gray-600 hover:text-black">Customer Service</Link></li>
              <li><Link to="/my-account" className="text-gray-600 hover:text-black">My Account</Link></li>
              <li><Link to="/store-locator" className="text-gray-600 hover:text-black">Store Locator</Link></li>
              <li><Link to="/legal-privacy" className="text-gray-600 hover:text-black">Legal & Privacy</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-black">Contact</Link></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sign up for Newsletter</h3>
            <p className="text-gray-600 mb-4">Be the first to know about our newest arrivals, special offers and store events.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 w-full border border-gray-300 focus:outline-none focus:border-black"
              />
              <button 
                type="submit" 
                className="bg-black text-white px-4 py-2 ml-2"
              >
                Subscribe
              </button>
            </form>
            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-300 mt-8 pt-8 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} ShopStyle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;