import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // Ensure Navbar component is properly defined
import HomePage from './components/HomePage'; // Ensure HomePage component is properly defined
import NotesPage from './components/NotesPage'; // Ensure NotesPage component is properly defined
import SubPage1 from './pages/SubPage1'; // Ensure SubPage1 component is properly defined
import SubPage2 from './pages/SubPage2'; // Ensure SubPage2 component is properly defined
import SubPage3 from './pages/SubPage3'; // Ensure SubPage3 component is properly defined
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
          <Route path="/notes/subpage2" element={<SubPage2 />} />
          <Route path="/notes/subpage3" element={<SubPage3 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
