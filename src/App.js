import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import NotesPage from './components/NotesPage';
import Test from './pages/Test';
import NoteSubPage from './pages/NoteSubPage';
import NameNotePage from './pages/NameNotePage';

import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/note/:noteId" element={<Test />} />
          <Route path="/create-note" element={<NameNotePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
