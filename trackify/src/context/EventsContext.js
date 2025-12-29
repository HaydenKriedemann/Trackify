import React, { createContext, useState, useContext } from 'react';

const EventsContext = createContext();

export function useEvents() {
  return useContext(EventsContext);
}

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([
    { 
      id: 1, 
      title: "Math Tutoring", 
      client: "Luca", 
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 14, 0),
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 15, 0),
      color: "#FF6B6B",
      completed: true
    },
    { 
      id: 2, 
      title: "Science Lesson", 
      client: "Sarah", 
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 16, 0),
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 17, 0),
      color: "#4ECDC4",
      completed: true
    }
  ]);

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: events.length + 1,
      completed: event.start < new Date() // Auto-complete if in past
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id, updates) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updates } : event
    ));
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const value = {
    events,
    addEvent,
    updateEvent,
    deleteEvent
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
}
