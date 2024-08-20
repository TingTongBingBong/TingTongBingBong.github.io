import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Import Firebase authentication
import './stylingfiles/Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/notes">Notes</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
      <div className="navbar-logo">
        <Link to="/">
          <span className="site-name">TingTongBingBong</span>
        </Link>
        <Link to="/">
          <img src="images/TTBBsite.gif" alt="TTBBs" className="logo-image" />
        </Link>
      </div>
      <div className="auth-section">
        {user ? (
          <div className="profile-dropdown">
            <button className="profile-button">
              <img src="profile-icon.png" alt="Profile" className="profile-icon" />
              <span>{user.email}</span>
            </button>
            <div className="profile-menu">
              <p>Profile</p>
              <p>Settings</p>
              <p>Logout</p>
            </div>
          </div>
        ) : (
          <Link to="/login" className="login-button">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
