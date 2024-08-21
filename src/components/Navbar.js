import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './stylingfiles/Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User Data:', userData); // Add this line
  
          // Check if terms are accepted, otherwise redirect to profile setup
          if (!userData.termsAccepted) {
            navigate('/profile-setup');
          } else {
            setUser(user);
            setUsername(userData.username);
            setProfilePicture(userData.profilePicture);
            console.log('Profile Picture:', userData.profilePicture); // Add this line
          }
        }
      } else {
        setUser(null);
        setUsername('');
        setProfilePicture('');
      }
    });
  
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      try {
        await auth.signOut();
        setUser(null);
        setUsername('');
        setProfilePicture('');
        navigate('/');
        window.location.reload();
      } catch (error) {
        console.error('Error logging out:', error.message);
      }
    }
  };

  const handleExternalLinkClick = (e, url) => {
    e.preventDefault(); // Prevent the default link behavior
    const userConfirmed = window.confirm('You are about to leave the TingTongBingBong site, do you wish to proceed?');
    if (userConfirmed) {
      window.open(url, '_blank');
    }
  };

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/notes">Notes</Link></li>
        <li><Link to="/about">About</Link></li>
        <li>
          <a href="#" onClick={(e) => handleExternalLinkClick(e, 'https://discord.gg/nPWxDAwegx')}>
            Discord
          </a>
        </li>
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
              {profilePicture && (
                <div className="profile-icon">
                  <img src={profilePicture} alt="Profile" />
                </div>
              )}
              <span>{username}</span>
            </button>
            <div className="profile-menu">
              <p onClick={() => navigate('/profile')}>Profile</p> {/* Styled like Logout */}
              <p onClick={handleLogout}>Logout</p>
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
