import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp, query, collection, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './stylingfiles/ProfilePage.css';

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [initialState, setInitialState] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || '');
          setProfilePictureURL(userData.profilePicture || '');

          // Save initial state to compare later
          setInitialState({
            username: userData.username || '',
            profilePictureURL: userData.profilePicture || '',
          });
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
    }
  };

  const hasChanges = () => {
    return (
      username !== initialState.username ||
      profilePictureFile !== null
    );
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');

    const user = auth.currentUser;

    if (!user) {
      console.error('No user is logged in');
      return;
    }

    // Check if the username has changed and is unique
    if (username !== initialState.username) {
      const q = query(collection(db, 'users'), where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('Username already taken. Please choose another one.');
        return;
      }
    }

    try {
      setUploading(true);

      let updatedProfilePictureURL = profilePictureURL;
      if (profilePictureFile) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, profilePictureFile);
        updatedProfilePictureURL = await getDownloadURL(storageRef);
        setProfilePictureURL(updatedProfilePictureURL); // Update the profile picture in the state
      }

      await setDoc(doc(db, 'users', user.uid), {
        username,
        profilePicture: updatedProfilePictureURL,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setUploading(false);
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error.message);
      setUploading(false);
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page-container">
      <div className="profile-page-content">
        <h2>Edit Your Profile</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {profilePictureURL && (
          <div className="profile-picture-container">
            <img src={profilePictureURL} alt="Profile" className="profile-picture" />
          </div>
        )}
        <form onSubmit={handleProfileUpdate}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          <button type="submit" disabled={!hasChanges() || uploading}>
            {uploading ? 'Uploading...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
