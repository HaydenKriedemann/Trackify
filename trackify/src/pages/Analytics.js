import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

function Analytics() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('month');
  const [analytics, setAnalytics] = useState({
    revenue: 0,
    sessions: 0,
    hours: 0,
    activeEmployees: 0,
    topClients: [],
    employeePerformance: []
  });

  useEffect(() => {
    // In a real app, this would fetch from backend
    const mockAnalytics = {
      revenue: 12500,
      sessions: 45,
      hours: 67.5,
      activeEmployees: 3,
      topClients: [
        { name: 'ABC Corporation', revenue: 5500, sessions: 15 },
        { name: 'XYZ Enterprises', revenue: 4200, sessions: 12 },
        { name: 'Global Tutors Inc', revenue: 2800, sessions: 8 }
      ],
      employeePerformance: [
        { name: 'John Smith', revenue: 5800, sessions: 18, hours: 27 },
        { name: 'Sarah Johnson', revenue: 4200, sessions: 15, hours: 24 },
        { name: 'Mike Davis', revenue: 2500, sessions: 12, hours: 16.5 }
      ]
    };
    setAnalytics(mockAnalytics);
  }, [timeframe]);

  return (
    <div className="dashboard-container">
      <Sidebar role="employer" />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Business Analytics</h1>
          <p>Detailed insights and performance analytics</p>
        </header>

        <div className="analytics-controls">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="form-input"
            style={{width: '200px'}}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div className="analytics-grid">
          <div className="analytics-card revenue">
            <h3>Total Revenue</h3>
            <div className="analytics-value">R{analytics.revenue.toLocaleString()}</div>
            <div className="analytics-trend positive">+12% from last {timeframe}</div>
          </div>
          
          <div className="analytics-card sessions">
            <h3>Completed Sessions</h3>
            <div className="analytics-value">{analytics.sessions}</div>
            <div className="analytics-trend positive">+8% from last {timeframe}</div>
          </div>
          
          <div className="analytics-card hours">
            <h3>Total Hours</h3>
            <div className="analytics-value">{analytics.hours}</div>
            <div className="analytics-trend positive">+15% from last {timeframe}</div>
          </div>
          
          <div className="analytics-card employees">
            <h3>Active Employees</h3>
            <div className="analytics-value">{analytics.activeEmployees}</div>
            <div className="analytics-trend neutral">No change</div>
          </div>
        </div>

        <div className="analytics-details">
          <div className="analytics-section">
            <h2>Top Clients</h2>
            <div className="clients-list">
              {analytics.topClients.map((client, index) => (
                <div key={index} className="client-item">
                  <div className="client-info">
                    <h4>{client.name}</h4>
                    <p>{client.sessions} sessions</p>
                  </div>
                  <div className="client-revenue">R{client.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-section">
            <h2>Employee Performance</h2>
            <div className="performance-list">
              {analytics.employeePerformance.map((employee, index) => (
                <div key={index} className="performance-item">
                  <div className="employee-info">
                    <h4>{employee.name}</h4>
                    <p>{employee.sessions} sessions • {employee.hours} hours</p>
                  </div>
                  <div className="employee-revenue">R{employee.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;