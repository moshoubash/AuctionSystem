import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} E-commerce Store</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
