import React, { useState, useEffect } from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import { FaRupeeSign } from 'react-icons/fa';
import { auth, fs, firebase } from '../Config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';

export const IndividualProduct = ({ individualproduct, addToCart }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Check if the product is in the user's wishlist
    const checkWishlist = async () => {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const wishlistRef = fs.collection('wishlist').doc(uid);
        const wishlistSnapshot = await wishlistRef.get();
        if (wishlistSnapshot.exists) {
          const wishlistData = wishlistSnapshot.data();
          if (wishlistData.products.includes(individualproduct.ID)) {
            setIsInWishlist(true);
          } else {
            setIsInWishlist(false);
          }
        } else {
          setIsInWishlist(false);
        }
      }
    };

    checkWishlist();
  }, [individualproduct.ID]);

  const handleAddToCart = () => {
    addToCart(individualproduct);
    setShowPopup(true);

    // Hide the pop-up message after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const handleAddToWishlist = async () => {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const wishlistRef = fs.collection('wishlist').doc(uid);
      const wishlistSnapshot = await wishlistRef.get();
      if (wishlistSnapshot.exists) {
        const wishlistData = wishlistSnapshot.data();
        if (wishlistData.products.includes(individualproduct.ID)) {
          // Product already exists in the wishlist, remove it
          const updatedProducts = wishlistData.products.filter((productId) => productId !== individualproduct.ID);
          wishlistRef.update({
            products: updatedProducts,
          });
          setIsInWishlist(false);
        } else {
          // Product does not exist in the wishlist, add it
          wishlistRef.update({
            products: firebase.firestore.FieldValue.arrayUnion(individualproduct.ID),
          });
          setIsInWishlist(true);
        }
      } else {
        // Wishlist document doesn't exist, create it and add the product
        wishlistRef.set({
          products: [individualproduct.ID],
        });
        setIsInWishlist(true);
      }
    }
  };

  return (
    <div className="products-container">
      <div className="product-card">
        <div className="product-image">
          <div className={`wishlist-button ${isInWishlist ? 'active' : ''}`} onClick={handleAddToWishlist}>
            <FontAwesomeIcon icon={faHeart} className="heart-icon" />
          </div>
          <img src={individualproduct.url} alt="product-img" />
          <div className="project-price1">
            <FaRupeeSign />
            {individualproduct.price}
          </div>
        </div>
        <div className="product-details">
          <div className="project-title">{individualproduct.title}</div>
          <div className="project-description">{individualproduct.description}</div>

          <div className="project-price">
            <FaRupeeSign />
            {individualproduct.price}
          </div>
        </div>
        <div className="button-container">
          <div className="add-to-cart-button" onClick={handleAddToCart}>
            ADD TO CART
          </div>
        </div>
      </div>
      {showPopup && <div className="popup-message">Added to cart</div>}
    </div>
  );
};
