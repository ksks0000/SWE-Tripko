import React, { useEffect, useContext } from 'react';
import './Main_Navbar-style.css';
import logo from '../images/navbar-logo.png';
import bootstrap from 'bootstrap';
import { useNavigate } from 'react-router-dom';
import logoutimg from '../images/logout.png';
import AuthContext, { extractRoleFromToken } from '../authentication/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const role = extractRoleFromToken();
  const isTourist = (role === "turista");

  useEffect(() => {
    // Navbar shrink function
    const navbarShrink = function () {
      const navbarCollapsible = document.body.querySelector('#mainNav');
      if (!navbarCollapsible) {
        return;
      }
      if (window.scrollY === 0) {
        navbarCollapsible.classList.remove('navbar-shrink');
      } else {
        navbarCollapsible.classList.add('navbar-shrink');
      }
    };

    navbarShrink();

    document.addEventListener('scroll', navbarShrink);

    /*
        // Bootstrap scrollspy 
        const mainNav = document.body.querySelector('#mainNav');
        if (mainNav) {
            new bootstrap.ScrollSpy(document.body, {
                target: '#mainNav',
                rootMargin: '0px 0px -40%',
            });
        };
        */

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = Array.from(
      document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
      responsiveNavItem.addEventListener('click', () => {
        if (window.getComputedStyle(navbarToggler).display !== 'none') {
          navbarToggler.click();
        }
      });
    });
  }, []);

  return (
    <div className="main_navbar-container" id="page-top">
      <nav
        className="navbar navbar-expand-lg navbar-dark fixed-top"
        id="mainNav"
      >
        <div className="container">
          <a className="navbar-brand" href="#page-top">
            <img src={logo} alt="Navbar Logo" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            Menu
            <i className="fas fa-bars ms-1"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#services">
                  Services
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#myroutes">
                  My Routes
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#publicroutes">
                  Public Routes
                </a>
              </li>
              <li className="nav-item">
                {isTourist ?
                  (
                    <a className="nav-link" href="#finishedroutes">
                      Subscribed Routes
                    </a>
                  ) : (
                    <a className="nav-link" href="#publishedroutes">
                      Published Routes
                    </a>
                  )
                }
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#tourguides">
                  Tour Guides
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  onClick={() =>
                    navigate('/main-page/profile', { replace: true })
                  }
                >
                  My Profile
                </a>
              </li>
              <li className="nav-item last-nav-item">
                <a
                  className="nav-link"
                  onClick={() => {
                    logout();
                  }}
                >
                  <img className="logout-image" src={logoutimg} alt="logout" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
