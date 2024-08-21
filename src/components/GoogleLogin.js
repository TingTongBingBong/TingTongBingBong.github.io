import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import './stylingfiles/GoogleLogin.css';

function GoogleLogin() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user already has the required fields in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists() || !userDoc.data().username || !userDoc.data().dateOfBirth) {
        // If required fields are missing, redirect to the profile setup page
        navigate('/profile-setup');
      } else {
        // Redirect to the homepage or dashboard
        navigate('/');
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error.message);
    }
  };

  return (
    <div className="google-signin">
      <img
        src="/images/google-logo.png" /* Path to the Google logo in the public directory */
        alt="Google Sign-In"
        className="google-logo"
        onClick={handleGoogleSignIn}
      />
    </div>
  );
}

export default GoogleLogin;
