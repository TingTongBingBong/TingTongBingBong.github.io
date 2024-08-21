import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import './stylingfiles/CreateNoteButton.css';

const CreateNoteButton = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleCreateNote = async () => {
    const user = auth.currentUser;
    if (!user) {
      setShowPopup(true);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists() || (userDoc.data().role !== 'admin' && !userDoc.data().canCreateNotes)) {
      setShowPopup(true);
      return;
    }

    // Proceed with note creation
    navigate('/create-note'); // Navigate to the page where the user will name the note
  };

  return (
    <div>
      <button onClick={handleCreateNote}>Create New Note</button>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>You do not have permission to create a note.</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNoteButton;
