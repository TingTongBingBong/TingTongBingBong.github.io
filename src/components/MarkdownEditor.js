import React, { useState } from 'react';
import Split from 'react-split';
import ReactMarkdown from 'react-markdown';
import './MarkdownEditor.css';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("");

  return (
    <Split className="split" sizes={[50, 50]} minSize={200}>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Write your markdown here..."
      />
      <div>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </Split>
  );
}

export default MarkdownEditor;
