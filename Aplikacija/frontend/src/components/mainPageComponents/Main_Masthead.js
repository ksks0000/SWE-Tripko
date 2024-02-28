import React from 'react';
import './Main_Masthead-style.css';

export default function Masthead() {
  return (
    <div className="masthead-container">
      <div className="masthead">
        <div className="container">
          <div className="masthead-subheading">Welcome To Tripko!</div>
          <div className="masthead-heading text-uppercase">
            Organize your trips
          </div>
          <a className="btn btn-primary btn-xl text-uppercase" href="#services">
            Tell Me More
          </a>
        </div>
      </div>
    </div>
  );
}
