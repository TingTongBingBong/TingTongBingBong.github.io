import React from 'react';
import EventCalendar from '../components/EventCalendar.js';
import './stylingfiles/HomePage.css';

const HomePage = () => {
  return (
    <div class="homepage-container">
      <div class="content-area">
        <EventCalendar />
      </div>
    </div>
  );
};

export default HomePage;
