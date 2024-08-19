import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateNoteButton = () => {
  const navigate = useNavigate();

  const handleCreateNote = () => {
    navigate('/create-note'); // Navigate to the page where the user will name the note
  };

  return <button onClick={handleCreateNote}>Create New Note</button>;
};

export default CreateNoteButton;
