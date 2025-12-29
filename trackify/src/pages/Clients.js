import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useClients } from "../context/ClientContext";

function Clients() {
  const { clients, addClient, deleteClient } = useClients();
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    hourlyRate: ""
  });

  const handleAddClient = () => {
    if (newClient.name && newClient.email) {
      addClient({
        ...newClient,
        hourlyRate: parseFloat(newClient.hourlyRate) || 0
      });
      setNewClient({ name: "", email: "", phone: "", hourlyRate: "" });
      setShowAddClient(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="employee" />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Client Management</h1>
          <p>Manage your clients and their information</p>
        </header>

        <div className="section-header">
          <h2>Your Clients</h2>
          <button 
            className="primary-btn"
            onClick={() => setShowAddClient(true)}
          >
            Add New Client
          </button>
        </div>

        <div className="clients-grid">
          {clients.map(client => (
            <div key={client.id} className="client-card">
              <h3>{client.name}</h3>
              <p><strong>Email:</strong> {client.email}</p>
              <p><strong>Phone:</strong> {client.phone}</p>
              <p><strong>Hourly Rate:</strong> R{client.hourlyRate}/hr</p>
              <div className="client-actions">
                <button className="secondary-btn">Edit</button>
                <button 
                  className="danger-btn"
                  onClick={() => deleteClient(client.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddClient && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add New Client</h3>
              <input
                type="text"
                placeholder="Client Name"
                value={newClient.name}
                onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                className="form-input"
              />
              <input
                type="email"
                placeholder="Email"
                value={newClient.email}
                onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                className="form-input"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newClient.phone}
                onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                className="form-input"
              />
              <input
                type="number"
                placeholder="Hourly Rate (R)"
                value={newClient.hourlyRate}
                onChange={(e) => setNewClient({...newClient, hourlyRate: e.target.value})}
                className="form-input"
              />
              <div className="modal-actions">
                <button onClick={handleAddClient} className="primary-btn">
                  Add Client
                </button>
                <button 
                  onClick={() => setShowAddClient(false)} 
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

export default Clients;