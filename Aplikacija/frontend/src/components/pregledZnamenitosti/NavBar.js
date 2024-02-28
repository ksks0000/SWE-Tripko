import React from 'react';
import { extractRoleFromToken } from '../authentication/AuthContext';

function NavBar(props) {
  const role = extractRoleFromToken();
  console.log(role);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png"
          alt="Logo"
          className="logo"
        />
      </a>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">
              <i className="bi bi-house-door-fill"></i> Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <i className="bi bi-person-fill"></i> Profile
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <i className="bi bi-gear-fill"></i> Settings
            </a>
          </li>
        </ul>
      </div>
      {(role === 'power-vodic' || role === 'admin') && (
        <button
          className={`NavBar--button${props.powerVodic ? 'Toggled' : ''} `}
          onClick={() => props.togglePowerVodic()}
        >
          Rezim dodavanja
        </button>
      )}
    </nav>
  );
}

export default NavBar;
