import React, { useEffect } from 'react';
import './style.css'; // Add your own CSS file for styling
import { Link } from 'react-router-dom';
import { auth } from '../Config';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'react-feather';
import img from '../assets/depositphotos_114542246-stock-illustration-initial-letter-ws-green-swoosh-removebg-preview.png';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      auth.signOut().then(() => {
        navigate('/'); // Assuming you have the 'navigate' function available
      });
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link className="logo-link" to="/">
          <img src={img} alt="Logo" className="logo-img" />
        </Link>
        <Link className="logo-text" to="/">
          weSell.com
        </Link>
      </div>
      <div className="actions">
        {!user && (
          <>
            <a className="signin" href="/signin">
              Sign In
            </a>
          </>
        )}
        {user && (
          <>
            <div className="username">{user}</div>
            <div className="cart-menu">
              <Link className="navlink" to="/cart">
                <ShoppingCart size={37} color="currentColor" className="cart-logo" />
              </Link>
            </div>
            <div className="logout">
              <button onClick={handleLogout} className="logout-btn">
                LOGOUT
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
