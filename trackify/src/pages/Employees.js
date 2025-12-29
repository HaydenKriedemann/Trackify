import React from "react";
import Sidebar from "../components/Sidebar";
import { useEmployees } from "../context/EmployeesContext";
import { useNavigate } from "react-router-dom";

function Employees() {
  const { employees, allEvents } = useEmployees();
  const navigate = useNavigate();

  const getEmployeeStats = (employeeId) => {
    const employeeEvents = allEvents.filter(event => 
      event.employeeId === employeeId && event.completed
    );
    
    const thisMonthEvents = employeeEvents.filter(event => 
      event.start.getMonth() === new Date().getMonth() &&
      event.start.getFullYear() === new Date().getFullYear()
    );

    return {
      totalSessions: employeeEvents.length,
      thisMonthSessions: thisMonthEvents.length,
      clients: [...new Set(employeeEvents.map(event => event.client))].length
    };
  };

  const handleViewEmployee = (employeeId) => {
    navigate(`/employee-view/${employeeId}`);
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="employer" />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>All Employees</h1>
          <p>Manage and view all your employees</p>
        </header>

        <div className="employees-grid">
          {employees.map(employee => {
            const stats = getEmployeeStats(employee.id);
            return (
              <div key={employee.id} className="employee-card">
                <div className="employee-header">
                  <h3>{employee.name}</h3>
                  <span className="employee-position">{employee.position}</span>
                </div>
                <div className="employee-details">
                  <p><strong>Email:</strong> {employee.email}</p>
                  <p><strong>Hourly Rate:</strong> R{employee.hourlyRate}</p>
                  <p><strong>Join Date:</strong> {employee.joinDate}</p>
                </div>
                <div className="employee-stats">
                  <div className="stat">
                    <span className="stat-value">{stats.totalSessions}</span>
                    <span className="stat-label">Total Sessions</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{stats.thisMonthSessions}</span>
                    <span className="stat-label">This Month</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{stats.clients}</span>
                    <span className="stat-label">Clients</span>
                  </div>
                </div>
                <button 
                  className="primary-btn"
                  onClick={() => handleViewEmployee(employee.id)}
                >
                  View Dashboard
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Employees;