import React, { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { fs, auth } from '../Config';

const DeliveryAdd = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [landmark, setLandmark] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    const newAddress = {
      name,
      address,
      city,
      state,
      postalCode,
      landmark,
    };
  
    // Store the address data in the "addresses" collection
    fs.collection('addresses')
      .doc(auth.currentUser.uid)
      .set(newAddress)
      .then(() => {
        console.log('Address data stored in Firestore successfully');
  
        setName('');
        setAddress('');
        setCity('');
        setState('');
        setPostalCode('');
        setLandmark('');
  
        setTimeout(() => {
          navigate('/paym');
        }, 2000);
      })
      .catch((error) => {
        console.error('Error storing address data:', error);
      });
  };
  
  const backbtn = () => {
    navigate('/');
  };

  return (
    <>
      <button className="back-btn" onClick={backbtn}>
        <FontAwesomeIcon icon={faArrowLeft} className="arrow" />
      </button>

      <div className="delivery-address-container">
        <form className="delivery-address-form" onSubmit={handleFormSubmit}>
          <h2 className="heading">Enter Your Delivery Address</h2>
          <br />
          <label>
            <span className="label-text">Name:</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </label>
          <label>
            <span className="label-text">Address:</span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              required
            />
          </label>
          <label>
            <span className="label-text">City:</span>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city"
              required
            />
          </label>
          <label>
            <span className="label-text">State:</span>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Enter your state"
              required
            />
          </label>
          <label>
            <span className="label-text">Postal Code:</span>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Enter your postal code"
              required
            />
          </label>
          <label>
            <span className="label-text">Landmark (Optional):</span>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Enter a landmark (optional)"
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default DeliveryAdd;
