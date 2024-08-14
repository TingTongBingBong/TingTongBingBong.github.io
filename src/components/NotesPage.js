import React from 'react';
import { Link } from 'react-router-dom';

const NotesPage = () => {
  return (
    <div>
      <h1>Notes Table of Contents</h1>
      <ul>
        <li><Link to="/notes/subpage1">SubPage 1</Link></li>
      </ul>
    </div>
  );
}

export default NotesPage;
