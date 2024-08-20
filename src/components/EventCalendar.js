import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './stylingfiles/CalendarCustom.css';
import { collection, addDoc, getDocs } from 'firebase/firestore';
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

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const addEvent = async () => {
    const eventName = window.prompt("Enter event name:");
    const eventLocation = window.prompt("Enter event location:");
    const eventDate = window.prompt("Enter event date (YYYY-MM-DD):");

    if (eventName && eventLocation && eventDate) {
        try {
            // Manually create a Date object to avoid time zone issues
            const [year, month, day] = eventDate.split('-').map(Number);
            const eventDateTime = new Date(year, month - 1, day, 12, 0, 0); // Set time to noon to avoid timezone issues

            await addDoc(collection(db, 'events'), {
                name: eventName,
                location: eventLocation,
                date: eventDateTime
            });

            // Re-fetch events to update the calendar
            const eventsCollection = collection(db, 'events');
            const eventsSnapshot = await getDocs(eventsCollection);
            const eventsList = eventsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEvents(eventsList);

            alert("Event added successfully!");
        } catch (error) {
            console.error("Error adding event: ", error);
        }
    } else {
        alert("All fields are required to add an event.");
    }
};



return (
    <div className="calendar-container">
      <h2>Server Event Calendar</h2>
      <Calendar 
        onChange={onChange} 
        value={date} 
        tileContent={tileContent}
      />
      <button className="add-event-button" onClick={addEvent}>Add Event</button>
      {selectedEvents.length > 0 && (
        <div className="event-details">
          <h3>Events on {formatDate(date)}:</h3>
          <ul>
            {selectedEvents.map(event => (
              <li key={event.id}>
                <strong>{event.name}</strong><br />
                Location: {event.location}<br />
                Date: {formatDate(event.date.toDate())}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EventCalendar;
