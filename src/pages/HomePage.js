import React from 'react';
import EventCalendar from '../components/EventCalendar.js';
import './stylingfiles/HomePage.css';

const HomePage = () => {
  return (
    <div class="homepage-container">
      <div class="homepage-content-area">
          <section className="homepage-site-exploration">
            <h2>Welcome to TingTongBingBong!</h2>
            <p>
              Visit the different pages in the top left to explore the site.
            </p>
          </section>
          <EventCalendar />
          <footer className="author-section">
             <p>WebApp created by rmalcolm1</p>
          </footer>
      </div>
    </div>
  );
};

export default HomePage;
