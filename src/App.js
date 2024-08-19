import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import NotesPage from './pages/NotesPage';
import NameNotePage from './pages/NameNotePage';
import AboutPage from './pages/AboutPage';

import Navbar from './components/Navbar';
import IDhandle from './components/IDhandle';


import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path="/note/:noteId" element={<IDhandle />} />
          <Route path="/create-note" element={<NameNotePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
