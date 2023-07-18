import React, { useEffect, useState } from 'react';
import Footer from './Footer';
import Products from './Products';
import { auth, fs } from '../Config';
import { useNavigate } from 'react-router-dom';
import Navbar1 from './Navbar1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';


export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedSortOption, setSelectedSortOption] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  function Getcurrentuser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      auth.onAuthStateChanged(user => {
        if (user) {
          fs.collection('users').doc(user.uid).get().then(snapshot => {
            setUser(snapshot.data().Fullname)
          })
        } else {
          setUser(null);
        }
      });
    }, []);

    return user;
  }

  const user = Getcurrentuser();


  const getProducts = async (sortOption) => {
    let productsCollection = fs.collection('products');

    if (selectedCategory) {
      productsCollection = productsCollection.where('category', '==', selectedCategory);
    }

    if (selectedPriceRange) {
      const [minPrice, maxPrice] = selectedPriceRange.split('-');
      productsCollection = productsCollection.where('price', '>=', parseInt(minPrice)).where('price', '<=', parseInt(maxPrice));
    }

    // Apply sorting based on selected option
    if (sortOption === 'priceLowToHigh') {
      productsCollection = productsCollection.orderBy('price', 'asc');
    } else if (sortOption === 'priceHighToLow') {
      productsCollection = productsCollection.orderBy('price', 'desc');
    } else if (sortOption === 'nameAZ') {
      productsCollection = productsCollection.orderBy('name', 'asc');
    } else if (sortOption === 'nameZA') {
      productsCollection = productsCollection.orderBy('name', 'desc');
    }

    // Apply search query filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery;
      productsCollection = productsCollection.where('name', '>=', lowerCaseQuery).where('name', '<=', lowerCaseQuery + '\uf8ff');
    }

    const productsSnapshot = await productsCollection.get();
    const productsArray = [];

    productsSnapshot.forEach((snap) => {
      const data = snap.data();
      data.ID = snap.id;
      productsArray.push(data);
    });

    setProducts(productsArray);
    setFilteredProducts(productsArray);
  };


  useEffect(() => {
    getProducts(selectedSortOption);
  }, [selectedCategory, selectedPriceRange, selectedSortOption, searchQuery]);

  function Getuseruid() {
    const [uid, SetUid] = useState(null);

    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          SetUid(user.uid);
        }
      });
    }, []); // Added dependencies array

    return uid;
  }

  const uid = Getuseruid();
  const addToCart = async (product) => {
    if (user !== null) {
      const cartRef = fs.collection('Cart' + uid);
      const docRef = cartRef.doc(product.ID);

      // Check if the product already exists in the cart
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        // Product already exists in the cart, update the quantity
        const existingProduct = docSnapshot.data();
        const updatedQty = existingProduct.qty + 1;
        const updatedTotalPrice = updatedQty * existingProduct.price;

        await docRef.update({
          qty: updatedQty,
          TotalPrice: updatedTotalPrice
        });

        console.log('Successfully updated quantity in cart');
      } else {
        // Product does not exist in the cart, add it with initial quantity
        const updatedProduct = {
          ...product,
          qty: 1,
          TotalPrice: product.price
        };

        try {
          await docRef.set(updatedProduct);
          console.log('Successfully added to cart');
        } catch (error) {
          console.error('Error adding to cart:', error);
        }
      }

      // Calculate the total values of all products in the cart
      const cartSnapshot = await cartRef.get();
      let totalQty = 0;
      let totalPrice = 0;

      cartSnapshot.forEach((doc) => {
        const product = doc.data();
        totalQty += product.qty;
        totalPrice += product.TotalPrice;
      });

      console.log('Total Quantity:', totalQty);
      console.log('Total Price:', totalPrice);
    } else {
      navigate('/signin');
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  return (
    <div>
      <Navbar1 user={user} />
      {/* <input type="text" value={searchQuery} onChange={handleSearch} placeholder="Search..." /> */}

      <div className="sidebar-container">
        <div className="menu-icon" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </div>
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
          <div className="container-fluid">
            <div className="filter-section">
              <h1>Apply Filters</h1>
              <div className="filter-section">
                <h2>Sort By</h2>
                <button onClick={() => setSelectedSortOption('')}>Default</button>
                <button onClick={() => setSelectedSortOption('priceLowToHigh')}>Price: Low to High</button>
                <button onClick={() => setSelectedSortOption('priceHighToLow')}>Price: High to Low</button>
                <button onClick={() => setSelectedSortOption('nameAZ')}>Name: A-Z</button>
                <button onClick={() => setSelectedSortOption('nameZA')}>Name: Z-A</button>
              </div>

              <h2>Categories</h2>
              <button onClick={() => setSelectedCategory('')}>All</button>
              <button onClick={() => setSelectedCategory('Fashion')}>Fashion</button>
              <button onClick={() => setSelectedCategory('Electronics')}>Electronics</button>
              <button onClick={() => setSelectedCategory('Home & Furniture')}>Home & Furniture</button>
              <button onClick={() => setSelectedCategory('Grocery')}>Grocery</button>
              <button onClick={() => setSelectedCategory('Beauty')}>Beauty</button>
              <button onClick={() => setSelectedCategory('Books')}>Books</button>
              <button onClick={() => setSelectedCategory('Grooming')}>Grooming</button>
              <button onClick={() => setSelectedCategory('Other')}>Other</button>
            </div>
            <div className="filter-section">
              <h2>Price Range</h2>
              <button onClick={() => setSelectedPriceRange('')}>All</button>
              <button onClick={() => setSelectedPriceRange('0-500')}>0 - 500</button>
              <button onClick={() => setSelectedPriceRange('500-1000')}>500-1000</button>
              <button onClick={() => setSelectedPriceRange('1000-5000')}>1000-5000</button>
              <button onClick={() => setSelectedPriceRange('5000-10000')}>5000-10000</button>
              <button onClick={() => setSelectedPriceRange('10000-99999999999')}>Above 10000</button>
            </div>
          </div>
        </div>
      </div>

      <div className="containerb">
        <div className="sidebarb">
          <div className="staticsidebarb">
            <div className="sidebar-containerb">
              <div className="sidebarb">
                <div className="container-fluidb">
                  <div className="filter-sectionb">
                    <h1>Apply Filters</h1>
                    <div className="filter-section">
                      <h2>Sort By</h2>
                      <button onClick={() => setSelectedSortOption('')}>Default</button>
                      <button onClick={() => setSelectedSortOption('priceLowToHigh')}>Price: Low to High</button>
                      <button onClick={() => setSelectedSortOption('priceHighToLow')}>Price: High to Low</button>
                      <button onClick={() => setSelectedSortOption('nameAZ')}>Name: A-Z</button>
                      <button onClick={() => setSelectedSortOption('nameZA')}>Name: Z-A</button>
                    </div>
                    <h2>Categories</h2>
                    <button onClick={() => setSelectedCategory('')}>All</button>
                    <button onClick={() => setSelectedCategory('Fashion')}>Fashion</button>
                    <button onClick={() => setSelectedCategory('Electronics')}>Electronics</button>
                    <button onClick={() => setSelectedCategory('Home & Furniture')}>Home & Furniture</button>
                    <button onClick={() => setSelectedCategory('Grocery')}>Grocery</button>
                    <button onClick={() => setSelectedCategory('Beauty')}>Beauty</button>
                    <button onClick={() => setSelectedCategory('Books')}>Books</button>
                    <button onClick={() => setSelectedCategory('Grooming')}>Grooming</button>
                    <button onClick={() => setSelectedCategory('Other')}>Other</button>
                  </div>
                  <div className="filter-sectionb">
                    <h2>Price Range</h2>
                    <button onClick={() => setSelectedPriceRange('')}>All</button>
                    <button onClick={() => setSelectedPriceRange('0-500')}>0 - 500</button>
                    <button onClick={() => setSelectedPriceRange('500-1000')}>500-1000</button>
                    <button onClick={() => setSelectedPriceRange('1000-5000')}>1000-5000</button>
                    <button onClick={() => setSelectedPriceRange('5000-10000')}>5000-10000</button>
                    <button onClick={() => setSelectedPriceRange('10000-99999999999')}>Above 10000</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="products-containerb">
          {products.length > 0 && <Products products={products} addToCart={addToCart} />}
          {products.length < 1 && <div className='container-fluid'>Loading..............</div>}

        </div>
      </div>
      <Footer />
    </div>
  );
}
