import React, { useState  } from "react";
import Sidebar from "../components/Sidebar";
import { useEmployees } from "../context/EmployeesContext";

function EmployerDashboard() {
  const { employees, allEvents } = useEmployees();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Calculate total business metrics across all employees
  const calculateBusinessMetrics = () => {
    const currentMonthEvents = allEvents.filter(event => 
      event.start.getMonth() === selectedMonth &&
      event.start.getFullYear() === selectedYear &&
      event.completed
    );

    const totalRevenue = currentMonthEvents.reduce((sum, event) => {
      const employee = employees.find(emp => emp.id === event.employeeId);
      if (!employee) return sum;
      
      const duration = (event.end - event.start) / (1000 * 60 * 60);
      return sum + (duration * employee.hourlyRate);
    }, 0);

    const totalHours = currentMonthEvents.reduce((sum, event) => {
      const duration = (event.end - event.start) / (1000 * 60 * 60);
      return sum + duration;
    }, 0);

    const uniqueClients = [...new Set(currentMonthEvents.map(event => event.client))].length;
    const completedSessions = currentMonthEvents.length;
    const activeEmployees = [...new Set(currentMonthEvents.map(event => event.employeeId))].length;

    return {
      totalRevenue,
      totalHours,
      uniqueClients,
      completedSessions,
      activeEmployees
    };
  };

  const metrics = calculateBusinessMetrics();

  // Get employee performance
  const getEmployeePerformance = () => {
    return employees.map(employee => {
      const employeeEvents = allEvents.filter(event => 
        event.employeeId === employee.id &&
        event.start.getMonth() === selectedMonth &&
        event.start.getFullYear() === selectedYear &&
        event.completed
      );

      const employeeRevenue = employeeEvents.reduce((sum, event) => {
        const duration = (event.end - event.start) / (1000 * 60 * 60);
        return sum + (duration * employee.hourlyRate);
      }, 0);

      const employeeHours = employeeEvents.reduce((sum, event) => {
        const duration = (event.end - event.start) / (1000 * 60 * 60);
        return sum + duration;
      }, 0);

      return {
        id: employee.id,
        name: employee.name,
        position: employee.position,
        sessions: employeeEvents.length,
        hours: employeeHours.toFixed(1),
        revenue: `R${employeeRevenue.toFixed(2)}`,
        hourlyRate: `R${employee.hourlyRate}`
      };
    });
  };

  const employeePerformance = getEmployeePerformance();

  // Get upcoming sessions across all employees
  const getUpcomingSessions = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return allEvents.filter(event => 
      event.start > new Date() && 
      event.start <= nextWeek &&
      !event.completed
    ).slice(0, 5).map(event => {
      const employee = employees.find(emp => emp.id === event.employeeId);
      return {
        ...event,
        employeeName: employee ? employee.name : 'Unknown'
      };
    });
  };

  const upcomingSessions = getUpcomingSessions();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = [2023, 2024, 2025];

  return (
    <div className="dashboard-container">
      <Sidebar role="employer" />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Business Overview</h1>
          <p>Total business performance across all employees</p>
        </header>

        {/* Month/Year Selector */}
        <div className="metrics-controls">
          <div className="form-row">
            <div className="form-group">
              <label>Month</label>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="form-input"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Year</label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="form-input"
              >
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Business Metrics */}
        <section className="dashboard-cards">
          <div className="card revenue-card">
            <h2>Total Revenue</h2>
            <p>R{metrics.totalRevenue.toFixed(2)}</p>
            <span className="card-subtitle">All Employees - {months[selectedMonth]} {selectedYear}</span>
          </div>
          <div className="card hours-card">
            <h2>Total Hours</h2>
            <p>{metrics.totalHours.toFixed(1)} hours</p>
            <span className="card-subtitle">All Employees - {months[selectedMonth]} {selectedYear}</span>
          </div>
          <div className="card clients-card">
            <h2>Active Clients</h2>
            <p>{metrics.uniqueClients} clients</p>
            <span className="card-subtitle">Across All Employees</span>
          </div>
          <div className="card sessions-card">
            <h2>Completed Sessions</h2>
            <p>{metrics.completedSessions} sessions</p>
            <span className="card-subtitle">All Employees - {months[selectedMonth]} {selectedYear}</span>
          </div>
        </section>

        <div className="employer-content">
          {/* Employee Performance */}
          <div className="employer-section">
            <div className="section-header">
              <h2>Employee Performance</h2>
            </div>
            <div className="performance-grid">
              {employeePerformance.map((employee) => (
                <div key={employee.id} className="performance-card">
                  <h3>{employee.name}</h3>
                  <p className="employee-position">{employee.position}</p>
                  <div className="performance-metrics">
                    <div className="metric">
                      <span className="metric-value">{employee.sessions}</span>
                      <span className="metric-label">Sessions</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">{employee.hours}</span>
                      <span className="metric-label">Hours</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">{employee.revenue}</span>
                      <span className="metric-label">Revenue</span>
                    </div>
                  </div>
                  <div className="employee-rate">
                    Rate: {employee.hourlyRate}/hr
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="employer-section">
            <div className="section-header">
              <h2>Upcoming Sessions (Next 7 Days)</h2>
            </div>
            <div className="upcoming-sessions">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map(session => (
                  <div key={session.id} className="session-card">
                    <div className="session-info">
                      <h3>{session.title}</h3>
                      <p><strong>Client:</strong> {session.client}</p>
                      <p><strong>Employee:</strong> {session.employeeName}</p>
                      <p><strong>Date:</strong> {session.start.toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {session.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <div 
                      className="session-color"
                      style={{ backgroundColor: session.color }}
                    ></div>
                  </div>
                ))
              ) : (
                <p className="no-data">No upcoming sessions in the next 7 days</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;