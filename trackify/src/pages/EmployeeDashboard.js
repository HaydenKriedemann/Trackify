import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useClients } from "../context/ClientContext";
import { useEvents } from "../context/EventsContext";

function EmployeeDashboard() {
  const { clients } = useClients();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    client: "",
    date: new Date().toISOString().split('T')[0],
    startTime: "09:00",
    endTime: "10:00"
  });

  // Client colors mapping
  const clientColors = {
    "Luca": "#FF6B6B",
    "Sarah": "#4ECDC4", 
    "James": "#45B7D1",
    "Emma": "#96CEB4",
    "Noah": "#FFEAA7"
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.client) {
      const start = new Date(`${newEvent.date}T${newEvent.startTime}`);
      const end = new Date(`${newEvent.date}T${newEvent.endTime}`);
      
      addEvent({
        title: newEvent.title,
        client: newEvent.client,
        start: start,
        end: end,
        color: clientColors[newEvent.client] || "#0070f3"
      });
      
      setNewEvent({
        title: "",
        client: "",
        date: new Date().toISOString().split('T')[0],
        startTime: "09:00",
        endTime: "10:00"
      });
      setShowEventModal(false);
    }
  };

  const handleEditEvent = () => {
    if (selectedEvent && selectedEvent.title && selectedEvent.client) {
      const start = new Date(`${selectedEvent.date}T${selectedEvent.startTime}`);
      const end = new Date(`${selectedEvent.date}T${selectedEvent.endTime}`);
      
      updateEvent(selectedEvent.id, {
        title: selectedEvent.title,
        client: selectedEvent.client,
        start: start,
        end: end,
        color: clientColors[selectedEvent.client] || "#0070f3"
      });
      
      setShowEditModal(false);
      setSelectedEvent(null);
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      setShowEditModal(false);
      setSelectedEvent(null);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent({
      ...event,
      date: event.start.toISOString().split('T')[0],
      startTime: event.start.toTimeString().slice(0, 5),
      endTime: event.end.toTimeString().slice(0, 5)
    });
    setShowEditModal(true);
  };

  const getEventsForDay = (day) => {
    return events.filter(event => 
      event.start.getDate() === day &&
      event.start.getMonth() === currentDate.getMonth() &&
      event.start.getFullYear() === currentDate.getFullYear()
    );
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Calendar rendering
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day);
    const isToday = new Date().getDate() === day && 
                   new Date().getMonth() === currentDate.getMonth() && 
                   new Date().getFullYear() === currentDate.getFullYear();
    
    calendarDays.push(
      <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
        <div className="day-number">{day}</div>
        <div className="day-events">
          {dayEvents.map(event => (
            <div 
              key={event.id} 
              className="calendar-event"
              style={{ backgroundColor: event.color, color: 'white' }}
              onClick={() => handleEventClick(event)}
              title={`${event.title} with ${event.client} (${formatTime(event.start)} - ${formatTime(event.end)})`}
            >
              <div className="event-time">{formatTime(event.start)}</div>
              <div className="event-title">{event.title}</div>
              <div className="event-client">{event.client}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalHours = events
    .filter(event => event.completed)
    .reduce((sum, event) => sum + ((event.end - event.start) / (1000 * 60 * 60)), 0);

  const upcomingSessions = events.filter(event => !event.completed && event.start > new Date()).length;
  const completedSessions = events.filter(event => event.completed).length;

  return (
    <div className="dashboard-container">
      <Sidebar role="employee" />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Teaching Schedule</h1>
          <p>Manage your tutoring sessions and track your calendar</p>
        </header>

        <section className="dashboard-cards">
          <div className="card">
            <h2>Total Hours</h2>
            <p>{totalHours.toFixed(1)} hours</p>
          </div>
          <div className="card">
            <h2>Upcoming Sessions</h2>
            <p>{upcomingSessions} sessions</p>
          </div>
          <div className="card">
            <h2>Completed Sessions</h2>
            <p>{completedSessions} sessions</p>
          </div>
        </section>

        <section className="calendar-section">
          <div className="calendar-header">
            <div className="calendar-navigation">
              <button className="nav-btn" onClick={() => navigateMonth(-1)}>
                ‹
              </button>
              <h2>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button className="nav-btn" onClick={() => navigateMonth(1)}>
                ›
              </button>
              <button className="today-btn" onClick={goToToday}>
                Today
              </button>
            </div>
            <button 
              className="primary-btn"
              onClick={() => setShowEventModal(true)}
            >
              + Create Session
            </button>
          </div>

          <div className="calendar-grid">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="calendar-day-header">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays}
          </div>
        </section>

        {/* Create Event Modal */}
        {showEventModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Schedule New Session</h3>
              
              <div className="form-group">
                <label>Session Title</label>
                <input
                  type="text"
                  placeholder="e.g., Math Tutoring, Science Lesson"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Student/Client</label>
                <select
                  value={newEvent.client}
                  onChange={(e) => setNewEvent({...newEvent, client: e.target.value})}
                  className="form-input"
                >
                  <option value="">Select a student</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.name}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={handleCreateEvent} className="primary-btn">
                  Create Session
                </button>
                <button 
                  onClick={() => setShowEventModal(false)} 
                  className="secondary-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Event Modal */}
        {showEditModal && selectedEvent && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Edit Session</h3>
              
              <div className="form-group">
                <label>Session Title</label>
                <input
                  type="text"
                  placeholder="e.g., Math Tutoring, Science Lesson"
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({...selectedEvent, title: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Student/Client</label>
                <select
                  value={selectedEvent.client}
                  onChange={(e) => setSelectedEvent({...selectedEvent, client: e.target.value})}
                  className="form-input"
                >
                  <option value="">Select a student</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.name}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={selectedEvent.date}
                  onChange={(e) => setSelectedEvent({...selectedEvent, date: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={selectedEvent.startTime}
                    onChange={(e) => setSelectedEvent({...selectedEvent, startTime: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={selectedEvent.endTime}
                    onChange={(e) => setSelectedEvent({...selectedEvent, endTime: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={handleEditEvent} className="primary-btn">
                  Save Changes
                </button>
                <button 
                  onClick={handleDeleteEvent} 
                  className="danger-btn"
                  style={{marginRight: 'auto'}}
                >
                  Delete Session
                </button>
                <button 
                  onClick={() => setShowEditModal(false)} 
                  className="secondary-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;