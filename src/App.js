import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Ensure Navbar component is properly defined
import HomePage from './components/HomePage'; // Ensure HomePage component is properly defined
import NotesPage from './components/NotesPage'; // Ensure NotesPage component is properly defined
import SubPage1 from './pages/SubPage1'; // Ensure SubPage1 component is properly defined


import './App.css'; // Global styles

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/subpage1" element={<SubPage1 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
