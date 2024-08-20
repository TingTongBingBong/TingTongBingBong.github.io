import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import CreateNoteButton from '../components/CreateNoteButton'; // Ensure the correct path
import './stylingfiles/NotesPage.css'

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
    <div class="notepage-container">
      <div class="note-content-area">
        <section className="note-page-content">
          <h2>Collaborative Notes</h2>
          <ul>
            {notes.map(noteId => (
              <li key={noteId}>
                <Link to={`/note/${noteId}`}>{noteId}</Link>
              </li>
            ))}
          </ul>
        </section>
        <CreateNoteButton />
      </div>
    </div>
  );
};

export default NotesPage;
