import React, { useContext } from 'react';
import './index-style.css';
import backgroundVideo from '../images/background.mp4';
import { NavLink, useNavigate } from 'react-router-dom';

import AuthContext from '../authentication/AuthContext';

export default function Index({ renderPage }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  return (
    <div className="index-container">
      <video
        className="bg-video"
        playsInline="playsinline"
        autoPlay="autoplay"
        muted="muted"
        loop="loop"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div className="masthead">
        <div className="masthead-content text-white">
          <div className="container-fluid px-4 px-lg-0">
            <h1 className="fst-italic lh-1 mb-4 h1">TRIPKO - Trip Planner</h1>
            <p className="mb-5 p">
              Let Tripko help you plan and organize your traveling. You can make
              your own private route or add a premade one to your future trip
              list. It also provides you with travel guides!
            </p>
            <div className="row input-group-newsletter">
              <div className="col-auto">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('sign-in-up')}
                >
                  Sign up
                </button>
                {/* <NavLink to={"sign-in-up"}>Sign up</NavLink> */}
              </div>
              <div className="col-auto">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('sign-in-up')}
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="social-icons">
        <div className="d-flex flex-row flex-lg-column justify-content-center align-items-center h-100 mt-3 mt-lg-0">
          <a className="btn btn-dark m-3 a" href="#!">
            <i className="fab fa-twitter"></i>
          </a>
          <a className="btn btn-dark m-3 a" href="#!">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            className="btn btn-dark m-3 a"
            href="https://www.instagram.com/tripko_planner/"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
