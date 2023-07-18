import React, { useState, useEffect } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { fs, auth } from '../Config';

const Paym = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [addressData, setAddressData] = useState({});

  useEffect(() => {
    // Fetch the address data from the 'addresses' collection
    const fetchAddress = async () => {
      try {
        const doc = await fs.collection('addresses').doc(auth.currentUser.uid).get();
        if (doc.exists) {
          setAddressData(doc.data());
        } else {
          console.log('Address not found');
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };
  
    fetchAddress();
  }, []);
  
  const handleMethodSelection = (method) => {
    setSelectedMethod(method);
    if (method === 'cash-on-delivery') {
      setShowPopup(false);
      setPopupData({ method });
    } else {
      setShowPopup(true);
      setPopupData({ method });
    }
  };

  const handlePopupSubmit = (e) => {
    e.preventDefault();

    // Ensure that the payment method is selected
    if (!popupData.method) {
      console.error('Payment method not selected');
      return;
    }

    // Fetch the cart data from "Cart+user.uid" collection
    fs.collection(`Cart${auth.currentUser.uid}`)
      .get()
      .then((querySnapshot) => {
        const cartData = [];
        querySnapshot.forEach((doc) => {
          cartData.push(doc.data());
        });

        const currentDate = new Date();
const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata' };

const orderDetails = {
  paymentMethod: popupData.method,
  datePlaced: currentDate.toLocaleDateString('en-GB', dateOptions),
  timePlaced: currentDate.toLocaleTimeString('en-IN', timeOptions),
  cart: cartData,
  address: addressData, // Assign the fetched address data
};


        // Add the order details to the "orderDetails" collection in the user's UID document
        fs.collection('orders')
          .doc(auth.currentUser.uid)
          .collection('orderDetails')
          .add(orderDetails)
          .then((docRef) => {
            console.log('Order details stored in Firestore successfully');
            // Additional actions after storing the order details

            // Show the "Order Placed" message
            alert('Order Placed');

            // Delete the documents from "Cart+user.uid" collection
            querySnapshot.forEach((doc) => {
              doc.ref.delete();
            });

            // Redirect to "/"
            navigate('/');
          })
          .catch((error) => {
            console.error('Error storing order details:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching cart data:', error);
      });
  };

  const backbtn = () => {
    navigate('/address');
  };


  return (
    <>
      <button className="back-btn" onClick={backbtn}>
        <FontAwesomeIcon icon={faArrowLeft} className="arrow" />
      </button>

      <div className="payment-method-container">
        <h2>Select a Payment Method</h2>
        <form className="payment-method-form" onSubmit={handlePopupSubmit}>
          <label>
            <input
              type="radio"
              value="credit-card"
              checked={selectedMethod === 'credit-card'}
              onChange={() => handleMethodSelection('credit-card')}
              required
            />
            <span className="payment-method-icon"></span>
            Credit Card
          </label>
          <label>
            <input
              type="radio"
              value="paypal"
              checked={selectedMethod === 'paypal'}
              onChange={() => handleMethodSelection('paypal')}
              required
            />
            <span className="payment-method-icon"></span>
            PayPal
          </label>
          <label>
            <input
              type="radio"
              value="stripe"
              checked={selectedMethod === 'stripe'}
              onChange={() => handleMethodSelection('stripe')}
              required
            />
            <span className="payment-method-icon"></span>
            Stripe
          </label>
          <label>
            <input
              type="radio"
              value="cash-on-delivery"
              checked={selectedMethod === 'cash-on-delivery'}
              onChange={() => handleMethodSelection('cash-on-delivery')}
              required
            />
            Cash on Delivery
          </label>
          <button type="submit">Submit</button>
        </form>

        {showPopup && (
          <div className="payment-popup">
            {/* <h3>{popupData.method} Payment Details</h3> */}
            <form onSubmit={handlePopupSubmit}>
              {/* Render additional form fields based on the selected payment method */}
              {/* For example, credit card form fields */}
              {popupData.method === 'credit-card' && (
                <>
                  <label>
                    Card Number:
                    <input
                      type="text"
                      value={popupData.cardNumber || ''}
                      onChange={(e) =>
                        setPopupData({
                          ...popupData,
                          cardNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </label>
                  <label>
                    Expiry Date:
                    <input
                      type="text"
                      value={popupData.expiryDate || ''}
                      onChange={(e) =>
                        setPopupData({
                          ...popupData,
                          expiryDate: e.target.value,
                        })
                      }
                      required
                    />
                  </label>
                  {/* Add more fields for CVV, Cardholder Name, etc. */}
                </>
              )}

              {/* Render form fields for other payment methods similarly */}
{/* 
              <button className="enter-btn" type="submit">
                Enter
              </button> */}
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Paym;
