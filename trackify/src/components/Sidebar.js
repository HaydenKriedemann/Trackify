import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const styles = {
  sidebar: {
    width: '250px',
    background: '#2c3e50',
    color: 'white',
    padding: '20px 0',
    minHeight: '100vh',
  },
  logo: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    borderBottom: '1px solid #34495e',
    marginBottom: '20px',
    cursor: 'pointer',
  },
  roleSwitch: {
    padding: '15px 20px',
    borderBottom: '1px solid #34495e',
    marginBottom: '20px',
  },
  roleButton: {
    width: '100%',
    padding: '10px',
    background: 'transparent',
    color: 'white',
    border: '1px solid #34495e',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
  roleButtonHover: {
    background: '#34495e',
  },
  menu: {
    listStyle: 'none',
    padding: 0,
  },
  menuItem: {
    padding: '15px 20px',
    cursor: 'pointer',
    borderLeft: '4px solid transparent',
    transition: 'all 0.3s ease',
  },
  menuItemHover: {
    background: '#34495e',
    borderLeft: '4px solid #0070f3',
  },
  activeItem: {
    background: '#34495e',
    borderLeft: '4px solid #0070f3',
  },
};

function Sidebar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();

  const employeeMenu = [
    { name: 'Dashboard', path: '/employee-dashboard' },
    { name: 'My Clients', path: '/clients' },
    { name: 'My Invoices', path: '/invoices' },
    { name: 'My Tasks', path: '/tasks' },
    { name: 'Time Tracking', path: '/time-tracking' },
    { name: 'My Profile', path: '/profile' },
  ];

  const employerMenu = [
    { name: 'Business Dashboard', path: '/employer-dashboard' },
    { name: 'All Employees', path: '/employees' },
    { name: 'All Clients', path: '/all-clients' },
    { name: 'All Invoices', path: '/all-invoices' },
    { name: 'Business Analytics', path: '/analytics' },
    { name: 'Business Settings', path: '/settings' },
  ];

  const menuItems = role === 'employee' ? employeeMenu : employerMenu;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleRoleSwitch = () => {
    // Navigate back to landing page instead of switching directly
    navigate('/');
  };

  const handleLogoClick = () => {
    if (role === 'employee') {
      navigate('/employee-dashboard');
    } else {
      navigate('/employer-dashboard');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.sidebar}>
      <div 
        style={styles.logo}
        onClick={handleLogoClick}
      >
        Trackify
      </div>

      {/* Role Switch Button */}
      <div style={styles.roleSwitch}>
        <button
          style={styles.roleButton}
          onClick={handleRoleSwitch}
          onMouseOver={(e) => e.target.style.background = styles.roleButtonHover.background}
          onMouseOut={(e) => e.target.style.background = 'transparent'}
        >
          Switch Account Type
        </button>
      </div>

      <ul style={styles.menu}>
        {menuItems.map((item, index) => (
          <li 
            key={index}
            style={{
              ...styles.menuItem,
              ...(isActive(item.path) ? styles.activeItem : {})
            }}
            onClick={() => handleNavigation(item.path)}
            onMouseOver={(e) => {
              if (!isActive(item.path)) {
                e.target.style.background = styles.menuItemHover.background;
                e.target.style.borderLeft = styles.menuItemHover.borderLeft;
              }
            }}
            onMouseOut={(e) => {
              if (!isActive(item.path)) {
                e.target.style.background = 'transparent';
                e.target.style.borderLeft = '4px solid transparent';
              }
            }}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;