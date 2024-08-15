import React, { useState, useEffect, forwardRef } from 'react';
import Split from 'react-split';
import ReactMarkdown from 'react-markdown';
import './MarkdownEditor.css';

const MarkdownEditor = forwardRef(({ initialContent = "", content = "", readOnly = false }, ref) => {
  const [markdown, setMarkdown] = useState(initialContent);
  const [history, setHistory] = useState([initialContent]); // Array to store history of states
  const [historyIndex, setHistoryIndex] = useState(0); // Track the current position in the history

  useEffect(() => {
    if (content) {
      setMarkdown(content);
      setHistory([content]);
      setHistoryIndex(0);
    }
  }, [content]);

  // Function to handle input changes and update history
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    const newHistory = history.slice(0, historyIndex + 1);
    setMarkdown(newValue);
    setHistory([...newHistory, newValue]);
    setHistoryIndex(newHistory.length);
  };

  // Handle "Ctrl + Z" and "Ctrl + Y" for undo/redo functionality
  const handleKeyDown = (e) => {
    if (e.ctrlKey) {
      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setMarkdown(history[newIndex]);
          setHistoryIndex(newIndex);
        }
      } else if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setMarkdown(history[newIndex]);
          setHistoryIndex(newIndex);
        }
      }
    }
  };

  // Function to add markdown syntax and update history
  const addMarkdownSyntax = (syntax, surround, numberedList = false) => {
    const textarea = ref.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeText = textarea.value.substring(0, start);
    const selectedText = textarea.value.substring(start, end);
    const afterText = textarea.value.substring(end);

    let newText;
    if (surround) {
      newText = selectedText
        .split('\n')
        .map(line => line ? `${syntax}${line}${syntax}` : '') // Apply syntax to non-empty lines
        .join('\n');
    } 
     else {
      newText = selectedText
        .split('\n')
        .map(line => `${syntax}${line}`)
        .join('\n');
    }

    const updatedMarkdown = beforeText + newText + afterText;
    setMarkdown(updatedMarkdown);
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, updatedMarkdown]);
    setHistoryIndex(newHistory.length);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + syntax.length, start + newText.length);
    }, 0);
  };

  // Custom function for adding links
  const addLink = () => {
    const textarea = ref.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeText = textarea.value.substring(0, start);
    const selectedText = textarea.value.substring(start, end);
    const afterText = textarea.value.substring(end);

    // Split the selected text by lines and apply the link formatting to each line
    const newText = selectedText
      .split('\n')
      .map(line => line ? `[${line}](http://)` : '') // Apply link formatting to non-empty lines
      .join('\n');

    const updatedMarkdown = beforeText + newText + afterText;
    setMarkdown(updatedMarkdown);
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, updatedMarkdown]);
    setHistoryIndex(newHistory.length);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  const processMarkdownWithLineBreaks = (text) => {
    return text.replace(/\n/g, '  \n'); // Adds two spaces at the end of each line
  };

  return (
    <div className="markdown-editor" onKeyDown={handleKeyDown}>
      {!readOnly && (
        <div className="markdown-toolbar">
          <button onClick={() => addMarkdownSyntax('**', true)}>Bold</button>
          <button onClick={() => addMarkdownSyntax('_', true)}>Italics</button>
          <button onClick={() => addMarkdownSyntax('# ', false)}>Heading</button>
          <button onClick={() => addMarkdownSyntax('* ', false)}>Bullet List</button>
          <button onClick={() => addMarkdownSyntax('- [ ] ', false)}>Checklist</button>
          <button onClick={addLink}>Link</button> {/* Updated Link Button */}
        </div>
      )}
      {!readOnly ? (
        <Split className="split" sizes={[50, 50]} minSize={200}>
          <textarea
            ref={ref}
            value={markdown}
            onChange={handleInputChange}
            placeholder="Write your markdown here..."
            style={{ height: "100%", width: "100%", resize: "none" }}
          />
          <div className="markdown-preview">
            <ReactMarkdown breaks>{processMarkdownWithLineBreaks(markdown)}</ReactMarkdown>
          </div>
        </Split>
      ) : (
        <div className="markdown-published">
          <ReactMarkdown breaks>{processMarkdownWithLineBreaks(markdown)}</ReactMarkdown>
        </div>
      )}
    </div>
  );
});

export default MarkdownEditor;
