import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li>
          <Link to="/notes">Notes</Link>
          <ul className="dropdown">
            <li><Link to="/notes/subpage1">SubPage 1</Link></li>
            <li><Link to="/notes/subpage2">SubPage 2</Link></li>
            <li><Link to="/notes/subpage3">SubPage 3</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
