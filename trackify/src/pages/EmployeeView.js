import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEmployees } from "../context/EmployeesContext";

function EmployeeView() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { employees, getEmployeeEvents } = useEmployees();

  const employee = employees.find(emp => emp.id === parseInt(employeeId));
  const employeeEvents = getEmployeeEvents(parseInt(employeeId));

  if (!employee) {
    return (
      <div className="dashboard-container">
        <Sidebar role="employer" />
        <div className="dashboard-content">
          <div className="error-message">
            <h2>Employee not found</h2>
            <button onClick={() => navigate('/employees')} className="primary-btn">
              Back to Employees
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate employee metrics - use current date
  const calculateMetrics = () => {
    const currentDate = new Date(); // Define currentDate here
    const currentMonthEvents = employeeEvents.filter(event => 
      event.start.getMonth() === currentDate.getMonth() &&
      event.start.getFullYear() === currentDate.getFullYear() &&
      event.completed
    );

    const totalRevenue = currentMonthEvents.reduce((sum, event) => {
      const duration = (event.end - event.start) / (1000 * 60 * 60);
      return sum + (duration * employee.hourlyRate);
    }, 0);

    const totalHours = currentMonthEvents.reduce((sum, event) => {
      const duration = (event.end - event.start) / (1000 * 60 * 60);
      return sum + duration;
    }, 0);

    const completedSessions = currentMonthEvents.length;
    const uniqueClients = [...new Set(currentMonthEvents.map(event => event.client))].length;

    return {
      totalRevenue,
      totalHours,
      completedSessions,
      uniqueClients
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="dashboard-container">
      <Sidebar role="employer" />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="employee-header">
            <h1>{employee.name}'s Dashboard</h1>
            <p>{employee.position} - Viewing as Employer</p>
            <button 
              onClick={() => navigate('/employees')}
              className="secondary-btn"
            >
              Back to All Employees
            </button>
          </div>
        </header>

        <section className="dashboard-cards">
          <div className="card">
            <h2>Monthly Revenue</h2>
            <p>R{metrics.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="card">
            <h2>Hours Worked</h2>
            <p>{metrics.totalHours.toFixed(1)} hours</p>
          </div>
          <div className="card">
            <h2>Completed Sessions</h2>
            <p>{metrics.completedSessions} sessions</p>
          </div>
          <div className="card">
            <h2>Active Clients</h2>
            <p>{metrics.uniqueClients} clients</p>
          </div>
        </section>

        <div className="employee-details-section">
          <div className="employer-section">
            <h2>Employee Information</h2>
            <div className="employee-info">
              <p><strong>Email:</strong> {employee.email}</p>
              <p><strong>Position:</strong> {employee.position}</p>
              <p><strong>Hourly Rate:</strong> R{employee.hourlyRate}</p>
              <p><strong>Join Date:</strong> {employee.joinDate}</p>
              <p><strong>Assigned Clients:</strong> {employee.clients.join(', ')}</p>
            </div>
          </div>

          <div className="employer-section">
            <h2>Recent Sessions</h2>
            <div className="recent-sessions">
              {employeeEvents.slice(0, 5).map(event => (
                <div key={event.id} className="session-item">
                  <div className="session-details">
                    <h4>{event.title}</h4>
                    <p>Client: {event.client} | Date: {event.start.toLocaleDateString()}</p>
                  </div>
                  <div className="session-status">
                    {event.completed ? 'Completed' : 'Upcoming'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeView;