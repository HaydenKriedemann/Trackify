import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete project proposal", client: "ABC Corporation", dueDate: "2024-01-15", status: "In Progress" },
    { id: 2, title: "Client meeting preparation", client: "XYZ Enterprises", dueDate: "2024-01-12", status: "Pending" },
    { id: 3, title: "Update website content", client: "ABC Corporation", dueDate: "2024-01-20", status: "Completed" }
  ]);

  const [newTask, setNewTask] = useState({ title: "", client: "", dueDate: "" });

  const addTask = () => {
    if (newTask.title && newTask.client) {
      const task = {
        id: tasks.length + 1,
        ...newTask,
        status: "Pending"
      };
      setTasks([...tasks, task]);
      setNewTask({ title: "", client: "", dueDate: "" });
    }
  };

  const updateTaskStatus = (id, status) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="employee" />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>My Tasks</h1>
          <p>Manage your assigned tasks and track progress</p>
        </header>

        <div className="section-header">
          <h2>Assigned Tasks</h2>
          <button className="primary-btn" onClick={() => document.getElementById('taskModal').style.display = 'block'}>
            Add New Task
          </button>
        </div>

        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-info">
                <h3>{task.title}</h3>
                <p><strong>Client:</strong> {task.client}</p>
                <p><strong>Due Date:</strong> {task.dueDate}</p>
                <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '-')}`}>
                  {task.status}
                </span>
              </div>
              <div className="task-actions">
                <select 
                  value={task.status} 
                  onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  className="status-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <button className="danger-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Task Modal */}
        <div id="taskModal" className="modal-overlay" style={{display: 'none'}}>
          <div className="modal">
            <h3>Add New Task</h3>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Client"
              value={newTask.client}
              onChange={(e) => setNewTask({...newTask, client: e.target.value})}
              className="form-input"
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              className="form-input"
            />
            <div className="modal-actions">
              <button onClick={addTask} className="primary-btn">
                Add Task
              </button>
              <button 
                onClick={() => document.getElementById('taskModal').style.display = 'none'} 
                className="secondary-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tasks;