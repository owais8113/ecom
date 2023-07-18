import React, { useState } from 'react';
import './style.css'; // Add your own CSS file for styling
import { Link } from 'react-router-dom';
import { auth } from '../Config';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, LogOut } from 'react-feather'; // Assuming you have the required Feather icons imported
import img from '../assets/LOGO.png';
import { FaShoppingBag } from 'react-icons/fa';

const Navbar1 = ({ user }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      auth.signOut().then(() => {
        navigate('/'); // Assuming you have the 'navigate' function available
      });
    }
  };

  const handleProfileMenuToggle = () => {
    setShowProfileMenu((prevShowProfileMenu) => !prevShowProfileMenu);
  };

  return (
    <nav className="navbar1">
      <div className="logo1">
        <Link className="logo-link1" to="/">
          <img src={img} alt="Logo" className="logo-img1" />
        </Link>
        <Link className="logo-text1" to="/">
          weSell.com
        </Link>
      </div>
      <div className="actions1">
        {!user && (
          <>
            <a className="signin1" href="/signin">
              Sign In
            </a>
          </>
        )}
        {user && (
          <>
            <div className="profile-menu1">
              <div className="profile-icon" onClick={handleProfileMenuToggle}>
                <User size={28} color="currentColor" className="profile-icon" />
              </div>
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <ul className="profile-menu-list">
                    <li className="profile-menu-item">
                      <Link to="/cart" className="profile-menu-link">
                        <ShoppingCart size={16} color="currentColor" className="profile-menu-icon" />
                        Cart
                      </Link>
                    </li>
                    <li className="profile-menu-item">
                      <Link to="/wishlist" className="profile-menu-link">
                        <Heart size={16} color="currentColor" className="profile-menu-icon" />
                        Wishlist
                      </Link>
                    </li>
                    <li className="profile-menu-item">
                      <Link to="/orders" className="profile-menu-link">
                      <FaShoppingBag className="profile-menu-icon" />Orders
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="logout1">
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

export default Navbar1;
