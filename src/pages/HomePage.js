import React from 'react';
import EventCalendar from '../components/EventCalendar.js'; // Adjust the path if necessary

const HomePage = () => {
  return (
    <div className="homepage">
      <h1>TingTongBingBong</h1>
      <EventCalendar /> {/* Use the EventCalendar component here */}
    </div>
  );
}

export default HomePage;
