import React, { useState } from 'react'
import './style.css'
import { FaRupeeSign } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { fs, auth } from '../Config';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
const IndividualCartProduct = ({ cartProduct, cartProductInc, cartProductdec }) => {
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  const increaseQuantity = () => {
    // setQuantity(quantity + 1);
    cartProductInc(cartProduct);
  };

  const decreaseQuantity = () => {
    cartProductdec(cartProduct);
  };

  const handledelete = () => {
    auth.onAuthStateChanged(user => {
      if (user) {
        fs.collection('Cart' + user.uid).doc(cartProduct.ID).delete().then(() => {
          // console.log('dec');


          // Hide the pop-up message after 3 seconds
          setTimeout(() => {
            setShowPopup(true);
            setShowPopup(false);
          }, 3000);
        })
      }
    })
  };
  if (!cartProduct) {
    return <div>No product data available.</div>;
  }

  return (
    <>
      <div>
        <div className="cart-product">
          <div className="product-container">
            <img className="cart-product-image" src={cartProduct.url} alt={cartProduct.title} />
          </div>
          <div className="product-details">
            <h3 className="product-name">{cartProduct.title}</h3>
            <p className="product-description">{cartProduct.description}</p>
            <div className="product-price1"><FaRupeeSign />{cartProduct.TotalPrice}</div>
          </div>
          <div className="product-price"><FaRupeeSign />{cartProduct.TotalPrice}</div>
          <div className="product-text quantity-box">
            <button className="quantity-button" onClick={increaseQuantity}>
              <AiOutlinePlus />
            </button>
            <span className="quantity">{cartProduct.qty}</span>
            <button className="quantity-button" onClick={decreaseQuantity}>
              <AiOutlineMinus />
            </button>
          </div>
          <span className='delete' onClick={handledelete}><FontAwesomeIcon icon={faTrash} />
          </span>
        </div>

      </div>
      {showPopup && <div className="popup-message">Successfully Deleted</div>}

    </>
  )
}

export default IndividualCartProduct;
