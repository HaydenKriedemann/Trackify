import React from "react";
import Sidebar from "../components/Sidebar";
import { useEmployees } from "../context/EmployeesContext";

function AllClients() {
  const { getAllClients, allEvents } = useEmployees();

  const allClients = getAllClients();

  const getClientStats = (clientName) => {
    const clientEvents = allEvents.filter(event => 
      event.client === clientName && event.completed
    );
    
    const totalSessions = clientEvents.length;
    const totalHours = clientEvents.reduce((sum, event) => {
      const duration = (event.end - event.start) / (1000 * 60 * 60);
      return sum + duration;
    }, 0);

    const employees = [...new Set(clientEvents.map(event => {
      const employee = allEvents.find(e => e.id === event.id)?.employeeId;
      return employee;
    }))].length;

    return { totalSessions, totalHours, employees };
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="employer" />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>All Clients</h1>
          <p>View all clients across all employees</p>
        </header>

        <div className="clients-grid">
          {allClients.map((client, index) => {
            const stats = getClientStats(client.name);
            return (
              <div key={index} className="client-card">
                <h3>{client.name}</h3>
                <p><strong>Assigned Employees:</strong> {client.assignedEmployees.join(', ')}</p>
                <div className="client-stats">
                  <div className="stat">
                    <span className="stat-value">{stats.totalSessions}</span>
                    <span className="stat-label">Total Sessions</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{stats.totalHours.toFixed(1)}</span>
                    <span className="stat-label">Total Hours</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{stats.employees}</span>
                    <span className="stat-label">Employees</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AllClients;