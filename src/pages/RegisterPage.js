import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './stylingfiles/RegisterPage.css';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) { // Check file size (10 MB)
      setProfilePicture(file);
      setFileSelected(true);
    } else {
      alert('File size must be 10 MB or less.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    // Validate firstName and lastName
    if (
      firstName.length > 25 || !/^[\w\d]+$/.test(firstName) ||
      lastName.length > 25 || !/^[\w\d]+$/.test(lastName)
    ) {
      alert('First name and last name must be 25 characters or less and contain only ASCII letters and numbers.');
      setIsLoading(false);
      return;
    }

    // Validate username
    if (username.length > 25 || !/^[\w\d]+$/.test(username)) {
      alert('Username must be 25 characters or less and contain only ASCII letters and numbers.');
      setIsLoading(false);
      return;
    }

    // Validate password
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
      alert('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
      setIsLoading(false);
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let profilePictureURL = '';
      if (profilePicture) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        const uploadTask = await uploadBytesResumable(storageRef, profilePicture);
        profilePictureURL = await getDownloadURL(uploadTask.ref);
      }

      await setDoc(doc(db, 'users', user.uid), {
        username,
        firstName,
        lastName,
        email: user.email,
        profilePicture: profilePictureURL,
        termsAccepted,
        createdAt: new Date(),
      });

      alert('User registered successfully!');
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Error registering user:', error.message);
      alert('Error registering user.');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="register-container">
      <div className="register-content-area">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
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
            onFocus={() => setShowPasswordRequirements(true)}
            onBlur={() => setShowPasswordRequirements(false)}
            maxLength="25"
            required
          />
          {showPasswordRequirements && (
            <div className="password-requirements">
              <p>Password must:</p>
              <ul>
                <li>Be at least 8 characters long and less than 25 characters</li>
                <li>Contain at least one uppercase letter</li>
                <li>Contain at least one lowercase letter</li>
                <li>Contain at least one number</li>
              </ul>
            </div>
          )}
          <div className="upload-container">
            <label htmlFor="profilePicture">
              {fileSelected ? "Profile Picture Selected" : "Upload Profile Picture"}
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="terms-acceptance">
            <p>Please review and accept our <a href="/terms" target="_blank">Terms and Conditions</a></p>
            <label className="switch">
              <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} required />
              <span className="slider"></span>
            </label>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
