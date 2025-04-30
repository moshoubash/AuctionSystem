import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          We-in
        </Link>

        <nav className="main-nav">
          <Link to="/">Home</Link>
          {isAuthenticated ? (
              <>
              <Link to="/products">Products</Link>
              <Link to="/cart">Cart ({itemCount})</Link>
              <div className="user-menu">
                <span>Hello, {user?.name}</span>
                <button
                  className="btn"
                  style={{ background: "red" }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
