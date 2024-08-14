import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <Link to="/notes">Notes</Link>
          {dropdownOpen && (
            <ul className="dropdown">
              <li><Link to="/notes/subpage1">SubPage 1</Link></li>

            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
