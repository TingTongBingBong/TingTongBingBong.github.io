import React, { useState } from 'react';
import MarkdownEditor from './MarkdownEditor';

const NoteSubPage = ({ title }) => {
  const [editMode, setEditMode] = useState(false);


  return (
    <div>
      <h1>{title}</h1>
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? "Publish" : "Edit"}
      </button>
      {editMode ? (
        <MarkdownEditor ref={editorRef} />
      ) : (
        <div>Your published content will appear here</div>
      )}
    </div>
  );
};

export default NoteSubPage;
