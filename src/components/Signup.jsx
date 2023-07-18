import React, { useState } from 'react';
import './style.css'; // Add your own CSS file for styling
import Footer from './Footer'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth, fs } from '../Config';
const SignUp = () => {

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('')
  const handleSignUp = (e) => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }
    e.preventDefault();
    // Implement sign-up logic here, e.g., send data to the database
    // console.log('Sign up form submitted');
    // console.log('Name:', name);
    // console.log('Email:', email);
    // console.log('Password:', password);
    auth.createUserWithEmailAndPassword(email, password).then((credentials) => {
      console.log(credentials);
      fs.collection('users').doc(credentials.user.uid).set({
        Fullname: name,
        Email: email,
        Password: password
      }).then(() => {
        setSuccessMsg('Signup Successfull. You will redirected to Signin');
        setName('');
        setEmail('');
        setPassword('');
        setErrorMessage('');
        setTimeout(() => {
          setSuccessMsg('');
          navigate('/signin')
        }, 3000)
      })
    }).catch((error) => {
      setErrorMessage(error.message);
    })
  };

  return (<>
    <div className="container">
      <div className="sign-up-form">
        <h2 className='form-heading'>Sign Up</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errorMessage && (
          <div className="error-message-container">
            <p className="error-message">{errorMessage}</p>
          </div>
        )}
        {successMsg && (
          <div className="success-message-container">
            <p className="success-message">{successMsg}</p>
          </div>
        )}
        <button onClick={handleSignUp}
          className='signup-btn'>Sign Up</button>

        <div>Already a user? <Link to="/signin" className='text'>Sign In</Link></div>
        <hr />
      </div>
    </div>
    <Footer /></>
  );
};

export default SignUp;
