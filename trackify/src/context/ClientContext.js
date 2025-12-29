import React, { createContext, useState, useContext } from 'react';

const ClientContext = createContext();

export function useClients() {
  return useContext(ClientContext);
}

export function ClientProvider({ children }) {
  const [clients, setClients] = useState([
    { id: 1, name: "ABC Corporation", email: "contact@abccorp.com", phone: "+27-555-0101", hourlyRate: 75 },
    { id: 2, name: "XYZ Enterprises", email: "info@xyz.com", phone: "+27-555-0102", hourlyRate: 85 }
  ]);

  const addClient = (client) => {
    const newClient = {
      ...client,
      id: clients.length + 1
    };
    setClients(prev => [...prev, newClient]);
  };

  const deleteClient = (id) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  const value = {
    clients,
    addClient,
    deleteClient
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
}

