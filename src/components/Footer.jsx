import React from 'react';
import './style.css'; // Add your own CSS file for styling
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: wesell@outlook.com</p>
            <p>Phone: +91 123 456 7890</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#"><FaFacebook  /></a>
              <a href="#"><FaTwitter  /></a>
              <a href="#"><FaInstagram  /></a>
            </div>
          </div>
        </div>
      </div>
        <div className="footer-bottom">
          <p>&copy; 2023 wesell.com | All rights reserved.</p>
        </div>
    </footer>
  );
};

export default Footer;
