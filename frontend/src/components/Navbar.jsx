import React from 'react';

/**
 * Navbar Component
 * Renders the top navigation header with the application title and system status badge.
 */
function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="navbar-logo-icon">👥</div>
          <div>
            <h1 className="navbar-title">Employee Management Portal</h1>
            <p className="navbar-subtitle">Full-Stack Spring Boot & React CRUD Application</p>
          </div>
        </div>
        <div className="navbar-meta">
          <span className="badge badge-online">● Backend Connected</span>
          <span className="badge badge-info">Admin Portal</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
