// src/components/Common/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ collapsed, onToggle, onSettingsClick, onHelpClick }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Dashboard' },
    { path: '/expenses', icon: '💰', label: 'Expenses' },
    { path: '/recurring', icon: '🔄', label: 'Recurring' },
    { path: '/planned', icon: '📅', label: 'Planned' },
    { path: '/goals', icon: '🎯', label: 'Goals' },
    { path: '/import-export', icon: '📁', label: 'Import/Export' },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>{!collapsed && 'Expense Tracker'}</h2>
        <button onClick={onToggle} className="toggle-btn">
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={onHelpClick} className="settings-btn">
          <span className="nav-icon">❓</span>
          {!collapsed && <span className="nav-label">Help</span>}
        </button>
        <button onClick={onSettingsClick} className="settings-btn">
          <span className="nav-icon">⚙️</span>
          {!collapsed && <span className="nav-label">Settings</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;