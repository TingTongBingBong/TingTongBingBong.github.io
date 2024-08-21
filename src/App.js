import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import NotesPage from './pages/NotesPage';
import NameNotePage from './pages/NameNotePage';
import AboutPage from './pages/AboutPage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import ProfilePage from './pages/ProfilePage';

import Navbar from './components/Navbar';
import IDhandle from './components/IDhandle';
import PrivateRoute from './components/PrivateRoute';  // Import PrivateRoute

import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notes" element={<NotesPage />} /> {/* Protected Route */}
          <Route path='/about' element={<AboutPage />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* New route */}
          <Route path="/note/:noteId" element={<IDhandle />} /> {/* Protected Route */}
          <Route path="/create-note" element={<PrivateRoute><NameNotePage /></PrivateRoute>} /> {/* Protected Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
