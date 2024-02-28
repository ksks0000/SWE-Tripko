import React from 'react';
import './Main_Services-style.css';

export default function Services() {
  return (
    <div className="services-container page-section" id="services">
      <div className="container">
        <div className="text-center">
          <h2 className="section-heading text-uppercase h2">Services</h2>
        </div>
        <br />
        <br />
        <br />
        <div className="row text-center">
          <div className="col-md-4">
            <span className="fa-stack fa-4x">
              <i className="fas fa-circle fa-stack-2x text-primary"></i>
              <i className="fas fa-route fa-stack-1x fa-inverse"></i>
            </span>
            <h4 className="my-3 h4">Make a route</h4>
            <p className="text-muted">
              Search all information about destinations and their prices. Pin on
              the map and create your own route with the sights you want to
              visit
            </p>
          </div>
          <div className="col-md-4">
            <span className="fa-stack fa-4x">
              <i className="fas fa-circle fa-stack-2x text-primary"></i>
              <i className="fas fa-dollar-sign fa-stack-1x fa-inverse"></i>
            </span>
            <h4 className="my-3 h4">Plan your budget</h4>
            <p className="text-muted">
              While creating your own route, the application calculates the
              price based on the added sights, so you can plan your budget
            </p>
          </div>
          <div className="col-md-4">
            <span className="fa-stack fa-4x">
              <i className="fas fa-circle fa-stack-2x text-primary"></i>
              <i className="fas fa-people-arrows fa-stack-1x fa-inverse"></i>
            </span>
            <h4 className="my-3 h4">Tour guide</h4>
            <p className="text-muted">
              Guides publish public tours that tourists can join. Book guides
              and then provide feedback on completed routes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
