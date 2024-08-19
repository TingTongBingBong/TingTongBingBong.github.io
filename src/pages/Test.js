import React from 'react';
import { useParams } from 'react-router-dom';
import NoteSubPage from './NoteSubPage';

const Test = () => {
    const { noteId } = useParams(); // Extract noteId from URL params
    return <NoteSubPage title={`Note ${noteId}`} noteId={noteId} />;
  };


export default Test;