import React, { useState, useEffect } from 'react';
import { fs, auth } from '../Config';
import './style.css';
import { FaRupeeSign } from 'react-icons/fa';
import Footer from './Footer';
import Navbar1 from './Navbar1';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth.currentUser;
        setCurrentUser(user);
        if (user && user.uid) {
          const querySnapshot = await fs
            .collection('orders')
            .doc(user.uid)
            .collection('orderDetails')
            .orderBy('datePlaced')
            .get();
          const orderData = querySnapshot.docs.map((doc) => doc.data());
          setOrders(orderData);
          setPaymentMethod(orderData[0].paymentMethod);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (auth.currentUser) {
      fetchOrders();
    }
  }, []);

  const toggleAddress = () => {
    setShowAddress((prevShowAddress) => !prevShowAddress);
  };

  return (
    <>
      <Navbar1 user={currentUser} />
        <hr />
        <h3 className="cart-heading2">Order Details</h3>
        <hr />
      <div className="my-orders-container2">
        {orders.length > 0 && (
          <>
            {orders.map((order, index) => (
              <div className="order-container" key={index}>
                <div className="cart-details2">
                  {order.address && (
                    <div className={`address-details2 ${showAddress ? 'open' : ''}`}>
                      <h3 className="address-toggle2" onClick={toggleAddress}>
                        Address
                      </h3>
                      <div className="address-content2">
                        <p className="address-info2">
                          {order.address.name}
                          <br />
                          {order.address.address}, {order.address.city}, {order.address.state},
                          {order.address.postalCode},
                          <br />
                          Landmark: {order.address.landmark}
                        </p>
                      </div>
                      <div className="total-price2">
                        Total Price: <FaRupeeSign />
                        {order.cart.length === 1 ? (
                          order.cart[0].TotalPrice
                        ) : (
                          order.cart.reduce((total, product) => total + product.TotalPrice, 0)
                        )}
                      </div>
                      <div className="payment-method2">Payment Method: {paymentMethod}</div>
                      
                      <div className="payment-method2">Date & Time: {order.datePlaced} | {order.timePlaced}</div>
                    </div>
                  )}
                  <div className="cart-content2">
                    {order.cart.map((product, index) => (
                      <div key={index} className="product-item2">
                        <div className="product-title2">{product.title}</div>
                        <div className="product-qty2">Qty: {product.qty}</div>
                        <div className="product-price2">
                          <FaRupeeSign />
                          {product.TotalPrice}
                        </div>
                        <div className="img">
                          <img src={product.url} alt="Product" className="product-image2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
