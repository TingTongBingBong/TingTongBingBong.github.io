import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import NotesPage from './pages/NotesPage';
import IDhandle from './components/IDhandle';
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
          <Route path="/note/:noteId" element={<IDhandle />} />
          <Route path="/create-note" element={<NameNotePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
