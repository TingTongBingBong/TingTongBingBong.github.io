import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Split from 'react-split';
import ReactMarkdown from 'react-markdown';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import './stylingfiles/MarkdownEditor.css';

const MarkdownEditor = forwardRef(({ initialContent = "", noteId, onContentChange, readOnly = false }, ref) => {
  const [markdown, setMarkdown] = useState(initialContent);

  useEffect(() => {
    if (noteId) {
      const fetchNote = async () => {
        const docRef = doc(db, "notes", noteId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetchedContent = docSnap.data().content;
          setMarkdown(fetchedContent);
          if (onContentChange) {
            onContentChange(fetchedContent);
          }
        }
      };
      fetchNote();
    }
  }, [noteId, onContentChange]);

  const handleInputChange = (e) => {
    const newMarkdown = e.target.value;
    setMarkdown(newMarkdown);
    if (onContentChange) {
      onContentChange(newMarkdown);
    }
  };

  useImperativeHandle(ref, () => ({
    getContent: () => markdown,
  }));

  // Function to replace line breaks with <br /> tags
  const renderMarkdown = (content) => {
    return content.split('\n').join('  \n'); // Double space before newline to ensure <br> in markdown
  };

  return (
    <div className="markdown-editor">
      {!readOnly && (
        <Split className="split" sizes={[50, 50]} minSize={200}>
          <textarea
            ref={ref}
            value={markdown}
            onChange={handleInputChange}
            placeholder="Write your markdown here..."
            style={{ height: "100%", width: "100%", resize: "none" }}
          />
          <div className="markdown-preview">
            <ReactMarkdown children={renderMarkdown(markdown)} />
          </div>
        </Split>
      )}
      {readOnly && (
        <div className="markdown-published">
          <ReactMarkdown children={renderMarkdown(markdown)} />
        </div>
      )}
    </div>
  );
});

export default MarkdownEditor;
