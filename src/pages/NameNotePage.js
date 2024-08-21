import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../firestoreUtils';
import { auth, db } from '../firebaseConfig'; // Import Firebase config
import { doc, getDoc } from 'firebase/firestore';
import './stylingfiles/NameNotePage.css';

const NameNotePage = () => {
  const [noteName, setNoteName] = useState('');
  const [isAdmin, setIsAdmin] = useState(null); // State to check if the user is admin
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role;
          setIsAdmin(role === 'admin');
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkUserRole();
  }, []);

  useEffect(() => {
    if (isAdmin === false) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedNoteName = noteName.trim().replace(/\s+/g, '-').toLowerCase();

    if (sanitizedNoteName === '') {
      alert('Please enter a valid note name.');
      return;
    }

    await createNote(sanitizedNoteName, `# ${noteName}\n\nThis is your new note. Start editing...`);
    navigate(`/note/${sanitizedNoteName}`);
  };

  if (isAdmin === null) {
    // Show a loading indicator while determining the user's role
    return <div>Loading...</div>;
  }

  return (
    <div className="name-note-page-container">
      <div className="name-note-page">
        <h2>Name Your Note</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={noteName}
            onChange={(e) => setNoteName(e.target.value)}
            placeholder="Enter note name"
          />
          <p>THIS NAME CANNOT BE CHANGED LATER!</p>
          <button type="submit">Create Note</button>
        </form>
      </div>
    </div>
  );
};

export default NameNotePage;
