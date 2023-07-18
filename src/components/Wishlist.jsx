import React, { useEffect, useState } from 'react';
import Navbar1 from './Navbar1';
import { auth, fs } from '../Config';
import { FaRupeeSign } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Footer from './Footer';
const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [userName, setUserName] = useState('');
  useEffect(() => {
    // Fetch the user's wishlist products
    const fetchWishlistProducts = async () => {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const wishlistRef = fs.collection('wishlist').doc(uid);
        const wishlistSnapshot = await wishlistRef.get();
        if (wishlistSnapshot.exists) {
          const wishlistData = wishlistSnapshot.data();
          const products = wishlistData.products;

          // Fetch the details of each product from the 'products' collection
          const productsArray = await Promise.all(
            products.map(async (productId) => {
              const productSnapshot = await fs.collection('products').doc(productId).get();
              if (productSnapshot.exists) {
                return { id: productId, ...productSnapshot.data() };
              }
              return null;
            })
          );

          // Filter out any products that could not be found
          const filteredProducts = productsArray.filter((product) => product !== null);

          setWishlistProducts(filteredProducts);
        }
      }
    };
    const getCurrentUser = () => {
      const user = auth.currentUser;
      if (user) {
        fs.collection('users').doc(user.uid).get().then(snapshot => {
          setUserName(snapshot.data().Fullname);
        });
      }
    };

    fetchWishlistProducts();
    getCurrentUser();

  }, []);

  const handledelete = async (productId) => {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const wishlistRef = fs.collection('wishlist').doc(uid);
      const wishlistSnapshot = await wishlistRef.get();
      if (wishlistSnapshot.exists) {
        const wishlistData = wishlistSnapshot.data();
        const updatedProducts = wishlistData.products.filter((id) => id !== productId);
        wishlistRef.update({
          products: updatedProducts,
        });
        setWishlistProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      }
    }
  };

  // function Getcurrentuser() {
  //   const [user, setUser] = useState(null);
  
  //   useEffect(() => {
  //     auth.onAuthStateChanged(user => {
  //       if (user) {
  //         fs.collection('users').doc(user.uid).get().then(snapshot => {
  //           setUser(snapshot.data().Fullname)
  //         })
  //       } else {
    //         setUser(null);
    //       }
  //     });
  //   }, []);

  //   return user;
  // }

  // const user = Getcurrentuser();
  
  return (
    <>
    <Navbar1 user={userName}/>
    <div>
      <h2 className='w-heading'>Wishlist</h2>
      {wishlistProducts.length > 0 ? (
        <div>
          {wishlistProducts.map((product) => (
            <div key={product.id}>
              <div className="cart-product">
                <div className="product-container">
                  <img className="cart-product-image" src={product.url} alt={product.title} />
                </div>
                <div className="product-details">
                  <h3 className="product-name">{product.title}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price1"><FaRupeeSign />{product.price}</div>
                </div>
                <div className="product-price"><FaRupeeSign />{product.price}</div>
                <span className='delete' onClick={() => handledelete(product.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </span>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products in the wishlist</p>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default Wishlist;
