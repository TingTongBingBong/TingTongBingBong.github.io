import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import CreateNoteButton from '../components/CreateNoteButton';
import './stylingfiles/NotesPage.css';
import ReactMarkdown from 'react-markdown';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      const notesCollection = collection(db, 'notes');
      const notesSnapshot = await getDocs(notesCollection);
      const notesList = notesSnapshot.docs.map(doc => {
        const data = doc.data();
        const preview = extractFirstH1(data.content);
        return {
          id: doc.id,
          ...data,
          preview
        };
      });
      setNotes(notesList);
    };

    fetchNotes();
  }, []);

  const extractFirstH1 = (content) => {
    if (!content) return 'No preview available';

    const lines = content.split('\n');
    for (let line of lines) {
      if (line.startsWith('# ')) { // This is how an h1 is usually represented in Markdown
        return line.replace('# ', ''); // Remove the '# ' to get the title text
      }
    }
    return 'No preview available';
  };

  const filteredNotes = notes.filter(note => 
    note.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="notepage-container">
      <div className="note-content-area">
        <section className="note-page-content">
          <h2>Collaborative Notes</h2>
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="search-bar"
          />
          <ul>
            {filteredNotes.map(note => (
              <li key={note.id}>
                <Link to={`/note/${note.id}`} className="note-link">
                  <strong>{note.id}</strong><br />
                  <small>
                    Last updated by {note.lastPublishedBy || 'Unknown'} on {
                      note.updatedAt ? 
                        new Date(note.updatedAt.seconds * 1000).toLocaleDateString() 
                        : 'N/A'
                    }
                  </small>
                  <p className="note-preview">{note.preview}</p>
                </Link>
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
