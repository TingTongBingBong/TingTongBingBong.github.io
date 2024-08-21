import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebaseConfig';
import './stylingfiles/ProfileSetupPage.css';

function ProfileSetupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [fileSelected, setFileSelected] = useState(false);

  const navigate = useNavigate();

  // Validation functions
  const validateName = (name) => /^[a-zA-Z\s]{1,25}$/.test(name);
  const validateUsername = (username) => /^[a-zA-Z0-9_]{1,25}$/.test(username);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) { // Check file size (10 MB)
      setProfilePictureFile(file);
      setFileSelected(true);
    } else {
      alert('File size must be 10 MB or less.');
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

    if (!validateName(firstName) || !validateName(lastName)) {
      alert('First name and last name must be 25 characters or less and can only contain letters.');
      return;
    }

    if (!validateUsername(username)) {
      alert('Username must be 25 characters or less and can only contain letters, numbers, and underscores.');
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
        const uploadTask = await uploadBytesResumable(storageRef, profilePictureFile);
        profilePictureURL = await getDownloadURL(uploadTask.ref);
      }

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email, // Store the user's email
        firstName,
        lastName,
        username,
        profilePicture: profilePictureURL,
        termsAccepted: true, // Ensure termsAccepted is true
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Save the username in the usernameCheck collection
      await setDoc(usernameDocRef, { used: true });

      setUploading(false);
      navigate('/#/');
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
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            maxLength="25"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            maxLength="25"
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength="25"
            required
          />
          <div className="upload-container">
            <label htmlFor="profilePicture">
              {fileSelected ? "Profile Picture Selected" : "Upload Profile Picture"}
            </label>
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
