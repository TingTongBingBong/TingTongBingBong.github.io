import React from 'react';
import { useParams } from 'react-router-dom';
import NoteSubPage from '../pages/NoteSubPage';

const IDhandle = () => {
    const { noteId } = useParams(); // Extract noteId from URL params
    return <NoteSubPage title={`Note ${noteId}`} noteId={noteId} />;
  };


export default IDhandle;