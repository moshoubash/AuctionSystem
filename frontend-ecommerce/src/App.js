// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Categories from './pages/Categories';
import Cart from './pages/Cart';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
};

export default App;