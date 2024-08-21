import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './stylingfiles/ProfilePage.css';

const ProfilePage = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFullName(userData.fullName || '');
          setUsername(userData.username || '');
          setDateOfBirth(userData.dateOfBirth || '');
          setProfilePictureURL(userData.profilePicture || '');
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      console.error('No user is logged in');
      return;
    }

    try {
      setUploading(true);

      let updatedProfilePictureURL = profilePictureURL;
      if (profilePictureFile) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, profilePictureFile);
        updatedProfilePictureURL = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        username,
        dateOfBirth,
        profilePicture: updatedProfilePictureURL,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setUploading(false);
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error.message);
      setUploading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page-container">
      <div className="profile-page-content">
        <h2>Edit Your Profile</h2>
        <form onSubmit={handleProfileUpdate}>
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

          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
