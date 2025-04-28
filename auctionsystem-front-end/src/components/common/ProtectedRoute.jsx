// components/common/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * A wrapper component for routes that should only be accessible to authenticated users.
 * If the user is not authenticated, they will be redirected to the login page.
 */
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // While checking authentication status, show nothing or a loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the current location in state
  // This allows redirecting back after login
  if (!user) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location, message: "Please log in to access this page." }} 
        replace 
      />
    );
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;