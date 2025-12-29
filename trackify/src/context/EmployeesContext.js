import React, { createContext, useState, useContext } from 'react';

const EmployeesContext = createContext();

export function useEmployees() {
  return useContext(EmployeesContext);
}

export function EmployeesProvider({ children }) {
  const [employees] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@trackify.com",
      position: "Math Tutor",
      hourlyRate: 75,
      clients: ["Luca", "Emma"],
      joinDate: "2023-01-15"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@trackify.com",
      position: "Science Tutor",
      hourlyRate: 85,
      clients: ["Sarah", "James"],
      joinDate: "2023-02-20"
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike.davis@trackify.com",
      position: "English Tutor",
      hourlyRate: 70,
      clients: ["Noah"],
      joinDate: "2023-03-10"
    }
  ]);

  const [allEvents] = useState([
    // Employee 1 events
    { 
      id: 1, 
      title: "Math Tutoring", 
      client: "Luca", 
      employeeId: 1,
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 14, 0),
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 15, 0),
      color: "#FF6B6B",
      completed: true
    },
    { 
      id: 2, 
      title: "Advanced Math", 
      client: "Emma", 
      employeeId: 1,
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 16, 10, 0),
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 16, 11, 0),
      color: "#4ECDC4",
      completed: true
    },
    // Employee 2 events
    { 
      id: 3, 
      title: "Science Lesson", 
      client: "Sarah", 
      employeeId: 2,
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 16, 0),
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 17, 0),
      color: "#45B7D1",
      completed: true
    },
    { 
      id: 4, 
      title: "Physics", 
      client: "James", 
      employeeId: 2,
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 17, 14, 0),
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 17, 15, 0),
      color: "#96CEB4",
      completed: true
    },
    // Employee 3 events
    { 
      id: 5, 
      title: "English Literature", 
      client: "Noah", 
      employeeId: 3,
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 18, 9, 0),
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 18, 10, 0),
      color: "#FFEAA7",
      completed: true
    }
  ]);

  const getAllClients = () => {
    const allClients = new Set();
    allEvents.forEach(event => {
      allClients.add(event.client);
    });
    return Array.from(allClients).map(client => ({
      name: client,
      assignedEmployees: employees.filter(emp => emp.clients.includes(client)).map(emp => emp.name)
    }));
  };

  const getAllInvoices = (month, year) => {
    const monthlyEvents = allEvents.filter(event => 
      event.start.getMonth() === month &&
      event.start.getFullYear() === year &&
      event.completed
    );

    const invoicesByClient = {};
    
    monthlyEvents.forEach(event => {
      const employee = employees.find(emp => emp.id === event.employeeId);
      if (!employee) return;

      const duration = (event.end - event.start) / (1000 * 60 * 60);
      const amount = duration * employee.hourlyRate;

      if (!invoicesByClient[event.client]) {
        invoicesByClient[event.client] = {
          client: event.client,
          lineItems: [],
          subtotal: 0,
          employee: employee.name
        };
      }

      invoicesByClient[event.client].lineItems.push({
        date: event.start.toLocaleDateString(),
        description: event.title,
        hours: duration,
        rate: employee.hourlyRate,
        amount: amount,
        employee: employee.name
      });

      invoicesByClient[event.client].subtotal += amount;
    });

    return Object.values(invoicesByClient).map(invoice => ({
      ...invoice,
      vat: invoice.subtotal * 0.15,
      total: invoice.subtotal * 1.15
    }));
  };

  const getEmployeeEvents = (employeeId) => {
    return allEvents.filter(event => event.employeeId === employeeId);
  };

  const value = {
    employees,
    allEvents,
    getAllClients,
    getAllInvoices,
    getEmployeeEvents
  };

  return (
    <EmployeesContext.Provider value={value}>
      {children}
    </EmployeesContext.Provider>
  );
}