import React, { useState, useRef, useEffect } from 'react';
import MarkdownEditor from '../components/MarkdownEditor';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import ReactMarkdown from 'react-markdown';
import './stylingfiles/NoteSubPage.css'

const NoteSubPage = ({ title, noteId }) => {
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState(""); // State to store the markdown content
  const editorRef = useRef(null); // Reference to the MarkdownEditor

  useEffect(() => {
    const fetchContent = async () => {
      if (noteId) {
        const docRef = doc(db, "notes", noteId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetchedContent = docSnap.data().content;
          setContent(fetchedContent);
        } else {
          console.log("No such document!");
        }
      } else {
        console.error("Note ID is missing");
      }
    };

    fetchContent();
  }, [noteId]);

  const handlePublish = async () => {
    const currentContent = editorRef.current.getContent();
    
    if (noteId) {
      try {
        await setDoc(doc(db, "notes", noteId), {
          content: currentContent,
          updatedAt: new Date(),
        });
        alert('Note published successfully!');
        setContent(currentContent); // Update the state with the saved content
      } catch (error) {
        console.error("Error saving note:", error);
        alert('Error saving the note');
      }
    } else {
      console.error("Error: Note ID is missing");
      alert('Error: Note ID is missing');
    }

    setEditMode(false);
  };

  const renderMarkdown = (content) => {
    return content.split('\n').join('  \n'); // Convert line breaks to Markdown line breaks
  };

  return (
    <div class='published-content'>
      <h1>{title}</h1>
      <button onClick={editMode ? handlePublish : () => setEditMode(true)}>
        {editMode ? "Publish" : "Edit"}
      </button>
      {editMode ? (
        <MarkdownEditor
          ref={editorRef}
          initialContent={content}
          noteId={noteId}
          onContentChange={setContent} // Update the content as the user types
        />
      ) : (
        <div>
          <h2>Published Content:</h2>
          <div>{content ? <ReactMarkdown children={renderMarkdown(content)} /> : "No content available."}</div>
        </div>
      )}
    </div>
  );
};

export default NoteSubPage;
