// pages/Profile.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../context/AuthContext';

const Profile = () => {
  const { user, updateUserData, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    // Initialize form data with user information
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
    
    // Fetch recent orders
    const fetchRecentOrders = async () => {
      try {
        const response = await axios.get('/api/orders?limit=5');
        setRecentOrders(response.data);
      } catch (err) {
        console.error('Error fetching recent orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    
    fetchRecentOrders();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileUpdated(false);
    setErrors({});
    setLoading(true);
    
    try {
      const response = await axios.patch(`/api/users/${user.id}`, {
        name: formData.name,
        email: formData.email,
      });
      
      // Update user data in context
      updateUserData(response.data);
      setProfileUpdated(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setProfileUpdated(false), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ profile: err.response?.data?.message || 'Failed to update profile. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordUpdated(false);
    setErrors({});
    setLoading(true);
    
    try {
      await axios.post('/api/user/password', {
        current_password: formData.current_password,
        password: formData.new_password,
        password_confirmation: formData.new_password_confirmation,
      });
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      }));
      
      setPasswordUpdated(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setPasswordUpdated(false), 3000);
    } catch (err) {
      console.error('Password update error:', err);
      
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ password: err.response?.data?.message || 'Failed to update password. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-light mb-8 uppercase tracking-wider">My Account</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Update Form */}
          <div className="bg-gray-50 p-6">
            <h2 className="text-xl font-light mb-6 uppercase">Profile Information</h2>
            
            {profileUpdated && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <p className="text-green-700">Your profile has been updated successfully.</p>
              </div>
            )}
            
            {errors.profile && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700">{errors.profile}</p>
              </div>
            )}
            
            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-black`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-black`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-black text-white font-medium uppercase tracking-wider text-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Change Password Form */}
          <div className="bg-gray-50 p-6">
            <h2 className="text-xl font-light mb-6 uppercase">Change Password</h2>
            
            {passwordUpdated && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <p className="text-green-700">Your password has been updated successfully.</p>
              </div>
            )}
            
            {errors.password && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700">{errors.password}</p>
              </div>
            )}
            
            <form onSubmit={handlePasswordUpdate}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    id="current_password"
                    name="current_password"
                    type="password"
                    value={formData.current_password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.current_password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-black`}
                  />
                  {errors.current_password && (
                    <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    id="new_password"
                    name="new_password"
                    type="password"
                    value={formData.new_password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.new_password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-black`}
                  />
                  {errors.new_password && (
                    <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="new_password_confirmation"
                    name="new_password_confirmation"
                    type="password"
                    value={formData.new_password_confirmation}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.new_password_confirmation ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-black`}
                  />
                  {errors.new_password_confirmation && (
                    <p className="mt-1 text-sm text-red-600">{errors.new_password_confirmation}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-black text-white font-medium uppercase tracking-wider text-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          {/* Recent Orders */}
          <div className="bg-gray-50 p-6">
            <h2 className="text-xl font-light mb-6 uppercase">Recent Orders</h2>
            
            {loadingOrders ? (
              <p className="text-gray-600">Loading recent orders...</p>
            ) : recentOrders.length === 0 ? (
              <p className="text-gray-600">No recent orders found.</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div key={order.id} className="border-b pb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Order #{order.id}</span>
                      <span className="text-sm capitalize">{order.status}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{new Date(order.created_at).toLocaleDateString()}</span>
                      <span className="font-medium">${parseFloat(order.total_price).toFixed(2)}</span>
                    </div>
                    <div className="mt-2">
                      <Link 
                        to={`/orders/${order.id}`} 
                        className="text-sm text-black hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
                
                <div className="mt-2 pt-2">
                  <Link 
                    to="/orders" 
                    className="text-sm text-black hover:underline"
                  >
                    View All Orders
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Account Actions */}
          <div className="bg-gray-50 p-6">
            <h2 className="text-xl font-light mb-6 uppercase">Account Actions</h2>
            
            <div className="space-y-4">
              <button
                onClick={logout}
                className="w-full px-4 py-2 border border-black text-black font-medium uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-colors"
              >
                Log Out
              </button>
              
              <Link 
                to="/cart" 
                className="block w-full px-4 py-2 text-center border border-black text-black font-medium uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-colors"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;