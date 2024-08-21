import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebaseConfig';
import GoogleLogin from '../components/GoogleLogin'; // Import the GoogleLogin component
import './stylingfiles/RegisterPage.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6; // Password must be at least 6 characters long
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]*$/;
    return nameRegex.test(name);
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    console.log('Starting registration process...');

    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    if (!validateName(fullName)) {
      alert('Full name can only contain letters and spaces.');
      return;
    }

    if (!validateUsername(username)) {
      alert('Username can only contain letters, numbers, and underscores.');
      return;
    }

    if (!termsAccepted) {
      alert('You must accept the Terms and Conditions.');
      return;
    }

    try {
      console.log('Checking if username is unique...');
      // Check if username is unique using the usernameCheck collection
      const usernameDocRef = doc(db, 'usernameCheck', username);
      const usernameDoc = await getDoc(usernameDocRef);

      if (usernameDoc.exists()) {
        setError('Username already taken. Please choose another one.');
        console.log('Username already taken.');
        return;
      }

      console.log('Creating the user in Firebase Authentication...');
      // Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User created with UID:', user.uid);

      // Upload the profile picture (if selected)
      let profilePictureURL = '';
      if (profilePictureFile) {
        console.log('Uploading profile picture...');
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, profilePictureFile);
        profilePictureURL = await getDownloadURL(storageRef);
        console.log('Profile picture uploaded:', profilePictureURL);
      } else {
        console.log('No profile picture uploaded.');
      }

      console.log('Saving user data in Firestore...');
      // Save the user data in Firestore after authentication
      await setDoc(doc(db, 'users', user.uid), {
        email,
        fullName,
        username,
        dateOfBirth,
        profilePicture: profilePictureURL,
        termsAccepted,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Save the username in the usernameCheck collection
      await setDoc(usernameDocRef, { used: true });

      console.log('User data stored in Firestore:', user.uid);
      navigate('/');
    } catch (error) {
      console.error('Error registering user:', error.message);
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-content-area">
        <h2>Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <input
            type="date"
            placeholder="Date of Birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
          <div className="upload-container">
            <label htmlFor="profilePicture">Upload Profile Picture</label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={(e) => setProfilePictureFile(e.target.files[0])}
            />
          </div>
          <div className="terms-acceptance">
            <p>Please review and accept our <a href="/#/about" target="_blank">Terms and Conditions</a></p>
            <label className="switch">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <span className="slider"></span>
            </label>
          </div>
          <button type="submit">Register</button>
        </form>

        <div className="alternative-signup">
          <p>Sign up with</p>
          <div className="google-login-button">
            <GoogleLogin />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
