import React, { useRef, useState } from 'react';
import Split from 'react-split';
import ReactMarkdown from 'react-markdown';
import './MarkdownEditor.css';

const MarkdownEditor = React.forwardRef((props, ref) => {
  const [markdown, setMarkdown] = useState("");

  return (
    <Split className="split" sizes={[50, 50]} minSize={200}>
      <textarea
        ref={ref} // Attach the ref to the textarea or any other element
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Write your markdown here..."
      />
      <div>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </Split>
  );
});

export default MarkdownEditor;
