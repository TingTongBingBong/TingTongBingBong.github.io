import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import './stylingfiles/LoginPage.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User signed in with Google:', result.user);
    } catch (error) {
      console.error('Error during Google sign-in:', error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content-area">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <div className="register-prompt">
          <p>Don't have an account?</p>
          <Link to="/register">
            <button className="register-button">Register Here</button>
          </Link>
        </div>

        <div className="google-signin">
          <img
            src="/images/google-logo.png" /* Path to the Google logo in the public directory */
            alt="Google Sign-In"
            className="google-logo"
            onClick={handleGoogleSignIn}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
