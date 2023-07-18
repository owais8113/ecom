import React, { useState } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Config'
import Footer from './Footer';


const SignIn = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setErrorMessage] = useState('');

  const handleSignIn = (e) => {
    // Implement sign-in logic here
    // console.log('Sign in form submitted');
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password).then(() => {
      setSuccessMsg('Successfully Logged In');
      setEmail('');
      setPassword('');
      setErrorMessage('');
      setTimeout(() => {
        setSuccessMsg('')
        navigate('/')
      }, 1000);
    }).catch(error => setErrorMessage(error.message));
  };

  return (<>
    <div className="container">
      <div className="sign-in-form">
        <form action="">
          <h2 className='form-heading'>Sign In</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <div className="error-message-container">
              <p className="error-message">{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="success-message-container">
              <p className="success-message">{successMsg}</p>
            </div>
          )}
          <button onClick={handleSignIn}
            className='signup-btn'>Sign In</button>
          <div >Not a user? <Link to="/signup" className='text'>Sign Up</Link></div>
          <hr />
        </form>
      </div>
    </div>
    <Footer />
  </>
  );
};

export default SignIn;