import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useClients } from "../context/ClientContext";

function TimeTracking() {
  const { clients } = useClients();
  const [timeEntries, setTimeEntries] = useState([
    { id: 1, client: "ABC Corporation", date: "2024-01-10", hours: 4, description: "Project planning" },
    { id: 2, client: "XYZ Enterprises", date: "2024-01-10", hours: 3, description: "Client meeting" }
  ]);

  const [newEntry, setNewEntry] = useState({
    client: "",
    date: new Date().toISOString().split('T')[0],
    hours: "",
    description: ""
  });

  const addTimeEntry = () => {
    if (newEntry.client && newEntry.hours) {
      const entry = {
        id: timeEntries.length + 1,
        ...newEntry,
        hours: parseFloat(newEntry.hours)
      };
      setTimeEntries([...timeEntries, entry]);
      setNewEntry({
        client: "",
        date: new Date().toISOString().split('T')[0],
        hours: "",
        description: ""
      });
    }
  };

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <div className="dashboard-container">
      <Sidebar role="employee" />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Time Tracking</h1>
          <p>Track your working hours and manage time entries</p>
        </header>

        <div className="time-stats">
          <div className="card">
            <h2>Total Hours This Week</h2>
            <p>{totalHours} hours</p>
          </div>
          <div className="card">
            <h2>Active Clients</h2>
            <p>{clients.length} clients</p>
          </div>
        </div>

        <div className="section-header">
          <h2>Add Time Entry</h2>
        </div>

        <div className="time-entry-form">
          <select 
            value={newEntry.client} 
            onChange={(e) => setNewEntry({...newEntry, client: e.target.value})}
            className="form-input"
          >
            <option value="">Select Client</option>
            {clients.map(client => (
              <option key={client.id} value={client.name}>
                {client.name}
              </option>
            ))}
          </select>
          
          <input
            type="date"
            value={newEntry.date}
            onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
            className="form-input"
          />
          
          <input
            type="number"
            step="0.5"
            placeholder="Hours worked"
            value={newEntry.hours}
            onChange={(e) => setNewEntry({...newEntry, hours: e.target.value})}
            className="form-input"
          />
          
          <input
            type="text"
            placeholder="Description of work"
            value={newEntry.description}
            onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
            className="form-input"
          />
          
          <button onClick={addTimeEntry} className="primary-btn">
            Add Time Entry
          </button>
        </div>

        <div className="section-header">
          <h2>Recent Time Entries</h2>
        </div>

        <div className="time-entries">
          {timeEntries.map(entry => (
            <div key={entry.id} className="time-entry-card">
              <div className="entry-info">
                <h3>{entry.client}</h3>
                <p><strong>Date:</strong> {entry.date}</p>
                <p><strong>Hours:</strong> {entry.hours}</p>
                <p><strong>Description:</strong> {entry.description}</p>
              </div>
              <div className="entry-amount">
                <strong>R{(entry.hours * (clients.find(c => c.name === entry.client)?.hourlyRate || 0)).toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimeTracking;