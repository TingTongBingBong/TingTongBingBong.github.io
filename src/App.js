import React, { useRef } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'; // Using HashRouter for compatibility with GitHub Pages
import Navbar from './components/Navbar'; // Importing the Navbar component
import HomePage from './components/HomePage'; // Importing the HomePage component
import NotesPage from './components/NotesPage'; // Importing the NotesPage component
import { SubPage1, SubPage2, SubPage3 } from './pages/SubPage1'; // Importing the note sub-pages
import './App.css'; // Importing global styles

function App() {
  return (
    <Router>
      <Navbar />  {/* Render the Navbar component at the top */}
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />  {/* Home page route */}
          <Route path="/notes" element={<NotesPage />} />  {/* Notes page route */}
          <Route path="/notes/subpage1" element={<SubPage1 />} />  {/* SubPage1 route */}
          <Route path="/notes/subpage2" element={<SubPage2 />} />  {/* SubPage2 route */}
          <Route path="/notes/subpage3" element={<SubPage3 />} />  {/* SubPage3 route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
