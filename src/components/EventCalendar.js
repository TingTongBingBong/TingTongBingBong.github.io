import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './stylingfiles/CalendarCustom.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const EventCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsList = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsList);
    };

    fetchEvents();
  }, []);

  const onChange = (newDate) => {
    setDate(newDate);
    // Filter events for the selected date
    const eventsForSelectedDate = events.filter(event => 
      new Date(event.date.toDate()).toDateString() === newDate.toDateString()
    );
    setSelectedEvents(eventsForSelectedDate);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasEvent = events.some(event => 
        new Date(event.date.toDate()).toDateString() === date.toDateString()
      );
      return hasEvent ? <div className="event-dot"></div> : null;
    }
  };

  return (
    <div className="calendar-container">
      <h2>Server Calendar</h2>
      <Calendar 
        onChange={onChange} 
        value={date} 
        tileContent={tileContent}
      />
      {selectedEvents.length > 0 && (
        <div className="event-details">
          <h3>Events on {date.toDateString()}:</h3>
          <ul>
            {selectedEvents.map(event => (
              <li key={event.id}>
                <strong>{event.name}</strong><br />
                Location: {event.location}<br />
                Date: {new Date(event.date.toDate()).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EventCalendar;
