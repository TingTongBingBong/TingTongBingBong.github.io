import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import CreateNoteButton from '../components/CreateNoteButton'; // Ensure the correct path

const NotesPage = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const notesCollection = collection(db, 'notes');
      const notesSnapshot = await getDocs(notesCollection);
      const notesList = notesSnapshot.docs.map(doc => doc.id); // Get the document IDs
      setNotes(notesList);
    };

    fetchNotes();
  }, []);

  return (
    <div>
      <h1>Collaborative Notes</h1>
      <ul>
        {notes.map(noteId => (
          <li key={noteId}>
            <Link to={`/note/${noteId}`}>{noteId}</Link>
          </li>
        ))}
      </ul>
      <CreateNoteButton />
    </div>
  );
};

export default NotesPage;
