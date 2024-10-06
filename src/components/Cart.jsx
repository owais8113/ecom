import React, { useEffect, useState } from 'react';
import Navbar1 from './Navbar1';
import { auth, fs } from '../Config';
import CartProducts from './CartProducts';
import { FaRupeeSign } from 'react-icons/fa';
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer'
const Cart = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  function Getcurrentuser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged(user => {
        if (user) {
          fs.collection('users').doc(user.uid).get().then(snapshot => {
            setUser(snapshot.data().Fullname)
          })
        }
        else {
          setUser(null);
        }
      })

    }, [])
    return user;
  }

  const user = Getcurrentuser();
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);


  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection('Cart' + user.uid).onSnapshot((snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setCartProducts(newCartProduct);
          calculateTotal(newCartProduct);
        });
      } else {
        console.log('error');
      }
    });
  }, []);
  // console.log(cartProducts);

  const calculateTotal = (cartProducts) => {
    let totalPrice = 0;
    let totalQty = 0;

    cartProducts.forEach((product) => {
      totalPrice += product.TotalPrice;
      totalQty += product.qty;
    });

    setTotalPrice(totalPrice);
    setTotalQty(totalQty);
  };

  let Product;

  const cartProductInc = (cartProduct) => {
    // console.log(cartProduct)
    Product = cartProduct;
    if (Product.qty < 10) {
      Product.qty = Product.qty + 1;
      Product.TotalPrice = Product.qty * Product.price;

      auth.onAuthStateChanged(user => {
        if (user) {
          fs.collection('Cart' + user.uid).doc(cartProduct.ID).update(Product).then(() => {
            console.log('inc');
          })
        }
      })
    }
    else {
      setShowPopup(true);

      // Hide the pop-up message after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  }

  const cartProductdec = (cartProduct) => {
    // console.log(cartProduct)
    Product = cartProduct;
    if (Product.qty > 1) {
      Product.qty = Product.qty - 1;
      Product.TotalPrice = Product.qty * Product.price;

      auth.onAuthStateChanged(user => {
        if (user) {
          fs.collection('Cart' + user.uid).doc(cartProduct.ID).update(Product).then(() => {
            console.log('dec');
          })
        }
      })
    }

  }
  return (
    <div>
      <Navbar1 user={user} />
      <hr />
      {
        cartProducts.length > 0 && (
          <div className='container-fluid'>
            <div className="product-box">
              <CartProducts cartProducts={cartProducts}
                cartProductInc={cartProductInc}
                cartProductdec={cartProductdec}
              />
            </div>

          </div>
        )
      }
      {
        cartProducts.length < 1 && (
          <div className='no-product'>NO PRODUCT TO SHOW</div>
        )
      }
      <hr />
      <div className="summary-box">
        <div className="heading-box">
          <h3 className='summary-heading'>Cart Summary</h3>

          <div className="cart-footer">
            {/* <hr /> */}
          </div>

          <div className="proceed-price">
            <div className="total-price">
              <div className='border-total'>
                Total: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FaRupeeSign /> {totalPrice}
                <br />
              </div>
              <div className='border-QTY'>
                &nbsp;&nbsp;Quantity: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{totalQty}&nbsp;&nbsp;
                <br />
              </div>
            </div>
            {totalPrice < 499 ? (
              <p className='subtitle'>*Free delivery above 499</p>
            ) : (
              <p className='subtitle'>*Your order is eligible for FREE Delivery.<FontAwesomeIcon icon={faCheck} className='icon-green' /></p>
            )}
            <div className="proceed-to-buy">
              {totalQty > 0 ? (
                <button className="proceed-button" onClick={() => navigate('/address')}>
                  Proceed to Buy
                </button>
              ) : (
                <button className="proceed-button" disabled>
                  Proceed to Buy
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {showPopup && <div className="popup-message">Max Quantity is 10 Per Product</div>}
    <Footer/>
    </div>
  );
};
export default Cart;

