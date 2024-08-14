import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import NotesPage from './components/NotesPage';
import { SubPage1, SubPage2, SubPage3 } from './pages/SubPage1';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/subpage1" element={<SubPage1 />} />
        <Route path="/notes/subpage2" element={<SubPage2 />} />
        <Route path="/notes/subpage3" element={<SubPage3 />} />
      </Routes>
    </Router>
  );
}

export default App;
