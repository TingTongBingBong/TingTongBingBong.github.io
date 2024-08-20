import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../firestoreUtils';
import './stylingfiles/NameNotePage.css';

const NameNotePage = () => {
  const [noteName, setNoteName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedNoteName = noteName.trim().replace(/\s+/g, '-').toLowerCase(); // Sanitize and format the note name

    if (sanitizedNoteName === '') {
      alert('Please enter a valid note name.');
      return;
    }

    await createNote(sanitizedNoteName, `# ${noteName}\n\nThis is your new note. Start editing...`);
    navigate(`/note/${sanitizedNoteName}`); // Redirect to the new note page
  };

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
        <p>
          THIS NAME CANNOT BE CHANGED LATER!
        </p>
        <button type="submit">Create Note</button>
      </form>
    </div>
    </div>
  );
};

export default NameNotePage;
