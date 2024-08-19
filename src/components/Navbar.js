import React from 'react';
import { Link } from 'react-router-dom';
import './stylingfiles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/notes">Notes</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
      <div className="navbar-logo">
        <span className="site-name">Ting Tong Bing Bong</span>
        <Link to="/">
          <img src="images/TTBBsite.gif" alt="TTBBs" className="logo-image" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
