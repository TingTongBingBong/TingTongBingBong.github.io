import React, { useState, useRef } from 'react';
import MarkdownEditor from './MarkdownEditor';

const NoteSubPage = ({ title }) => {
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState(""); // State to store the markdown content
  const editorRef = useRef(null); // Reference to the MarkdownEditor

  const handlePublish = () => {
    // Capture the content from the editor and store it in the state
    if (editorRef.current) {
      setContent(editorRef.current.value);
    }
    setEditMode(false);
  };

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={editMode ? handlePublish : () => setEditMode(true)}>
        {editMode ? "Publish" : "Edit"}
      </button>
      {editMode ? (
        <MarkdownEditor ref={editorRef} initialContent={content} />
      ) : (
        <div>
          <h2>Published Content:</h2>
          <div>{content ? <MarkdownEditor content={content} readOnly={true} /> : "No content available."}</div>
        </div>
      )}
    </div>
  );
};

export default NoteSubPage;
