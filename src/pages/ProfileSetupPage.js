import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebaseConfig';
import './stylingfiles/ProfileSetupPage.css';

function ProfileSetupPage() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]*$/;
    return nameRegex.test(name);
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
    }
  };

  const handleProfileSetup = async (e) => {
    e.preventDefault();
    setError('');

    const user = auth.currentUser;

    if (!user) {
      console.error('No user is logged in');
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

      console.log('Username is available. Proceeding with profile setup...');
      setUploading(true);
      let profilePictureURL = '';

      if (profilePictureFile) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, profilePictureFile);
        profilePictureURL = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email, // Store the user's email
        fullName,
        username,
        dateOfBirth,
        profilePicture: profilePictureURL,
        termsAccepted: true, // Ensure termsAccepted is true
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Save the username in the usernameCheck collection
      await setDoc(usernameDocRef, { used: true });

      setUploading(false);
      navigate('/');
    } catch (error) {
      console.error('Error saving user profile:', error.message);
      setUploading(false);
      setError(error.message);
    }
  };

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-content">
        <h2>Complete Your Profile</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleProfileSetup}>
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
              onChange={handleFileChange}
            />
          </div>

          <div className="terms-acceptance">
            <p>Please review and accept our <a href="/about" target="_blank">Terms and Conditions</a></p>
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

          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetupPage;
