import React, { useState, useRef, useEffect } from 'react';
import MarkdownEditor from '../components/MarkdownEditor';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import ReactMarkdown from 'react-markdown';
import './stylingfiles/NoteSubPage.css';

const NoteSubPage = ({ title, noteId }) => {
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState(""); // State to store the markdown content
  const [lastPublishedBy, setLastPublishedBy] = useState(""); // State to store the last publisher's username
  const [lastUpdatedAt, setLastUpdatedAt] = useState(""); // State to store the last updated timestamp
  const editorRef = useRef(null); // Reference to the MarkdownEditor

  useEffect(() => {
    const fetchContent = async () => {
      if (noteId) {
        const docRef = doc(db, "notes", noteId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetchedContent = docSnap.data().content;
          setContent(fetchedContent);
          setLastPublishedBy(docSnap.data().lastPublishedBy || "Unknown");
          setLastUpdatedAt(docSnap.data().updatedAt ? new Date(docSnap.data().updatedAt.seconds * 1000).toLocaleString() : "Unknown");
        } else {
          console.log("No such document!");
        }
      } else {
        console.error("Note ID is missing");
      }
    };

    fetchContent();
  }, [noteId]);

  const checkEditPermission = async () => {
    const user = auth.currentUser;
    if (user && noteId) {
      try {
        const docRef = doc(db, "notes", noteId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const noteData = docSnap.data();
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();

          if (noteData.users.includes(userData.username) || userData.role === 'admin') {
            setEditMode(true);
          } else {
            alert('You do not have permission to edit this note.');
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
        alert('Error checking permissions.');
      }
    } else {
      console.error("User or Note ID is missing");
      alert('Error: User or Note ID is missing');
    }
  };

  const handlePublish = async () => {
    const currentContent = editorRef.current.getContent();
    const user = auth.currentUser;
    
    if (noteId && user) {
      try {
        // Get the existing document to preserve the 'users' field
        const noteRef = doc(db, "notes", noteId);
        const noteSnap = await getDoc(noteRef);

        if (noteSnap.exists()) {
          const noteData = noteSnap.data();

          // Update the document with content, updatedAt, and the user who published it
          await setDoc(noteRef, {
            content: currentContent,
            updatedAt: new Date(),
            lastPublishedBy: user.displayName || user.email, // Store the user's display name or email
            users: noteData.users // Preserve the 'users' field
          }, { merge: true });

          alert('Note published successfully!');
          setContent(currentContent); // Update the state with the saved content
          setLastPublishedBy(user.displayName || user.email); // Update the state with the user's info
          setLastUpdatedAt(new Date().toLocaleString()); // Update the state with the current time
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error saving note:", error);
        alert('Error saving the note');
      }
    } else {
      console.error("Error: Note ID or User is missing");
      alert('Error: Note ID or User is missing');
    }

    setEditMode(false);
  };

  const renderMarkdown = (content) => {
    return content.split('\n').join('  \n'); // Convert line breaks to Markdown line breaks
  };

  return (
    <div className="published-content">
      <h1 className="note-title">{title}</h1> {/* Specific class for the note title */}
      {editMode ? (
        <MarkdownEditor
          ref={editorRef}
          initialContent={content}
          noteId={noteId}
          onContentChange={setContent} // Update the content as the user types
        />
      ) : (
        <div>
          <p className="note-info">Last edited by {lastPublishedBy} on {lastUpdatedAt}</p>
          <h2>Published Content:</h2>
          <div>{content ? <ReactMarkdown children={renderMarkdown(content)} /> : "No content available."}</div>
        </div>
      )}
      <div className="edit-button-container">
        <button className="edit-button" onClick={editMode ? handlePublish : checkEditPermission}>
          {editMode ? "Publish" : "Edit"}
        </button>
      </div>
    </div>
  );  
};

export default NoteSubPage;
