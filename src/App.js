import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Signin from './components/Signin';
import Home from './components/Home';
import Signup from './components/Signup'
import Addproducts from './components/Addproduct';
import Cart from './components/Cart';
import DeliveryAdd from './components/DeliveryAdd'
import Paym from './components/Paym'
import Wishlist from './components/Wishlist';
import MyOrders from './components/MyOrders';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/' Component={Home} />
          <Route exact path='/signin' Component={Signin} />
          <Route exact path='/signup' Component={Signup} />
          <Route exact path='/addproduct' Component={Addproducts} />
          <Route exact path='/cart' Component={Cart} />
          <Route exact path='/address' Component={DeliveryAdd} />
          <Route exact path='/paym' Component={Paym} />
          <Route exact path='/orders' Component={MyOrders} />
          <Route exact path='/wishlist' Component={Wishlist} />
          
        </Routes>

      </Router>
    </div>
  );
}

export default App;
