import React from 'react';
import './Main_TourGuides-style.css';
import tourGuide1 from '../images/1.jpg'; // brisi
import tourGuide2 from '../images/2.jpg'; // brisi
import tourGuide3 from '../images/3.jpg'; // brisi
import profileImg from "../images/profile-image.jpg"
import { useEffect } from 'react';
import jwtInterceptor from '../authentication/jwtInterceptor';
import { useState } from 'react';

export default function TourGuides() {
  const [fetchedData, setFetchedData] = useState(null);
  useEffect(() => {
    jwtInterceptor
      .get('http://localhost:5174/PowerVodic/PreuzmiPowerVodice')
      .then((response) => {
        setFetchedData(response.data);
        console.log(fetchedData);
      });
  }, []);

  return (
    <div className="tourGuides-container">
      <section className="page-section bg-light" id="tourguides">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase h2">Tour Guides</h2>
            <h3 className="section-subheading text-muted h3">
              Meet your tour guides
            </h3>
          </div>
          <div className="row">
            {fetchedData !== null &&
              fetchedData.map((data, index) => {
                if (index < 3)
                  return (
                    <div className="col-lg-4">
                      <div className="team-member">
                        <img
                          className="mx-auto rounded-circle"
                          src={profileImg}
                          alt="..."
                        />
                        <h4 className="h4">{`${data.ime} ${data.prezime}`}</h4>
                        <p className="text-muted">Tour Guide</p>
                        <a
                          className="btn btn-dark btn-social mx-2"
                          href="#!"
                          aria-label="Parveen Anand Twitter Profile"
                        >
                          <i className="fab fa-twitter"></i>
                        </a>
                        <a
                          className="btn btn-dark btn-social mx-2"
                          href="#!"
                          aria-label="Parveen Anand Facebook Profile"
                        >
                          <i className="fab fa-facebook-f"></i>
                        </a>
                        <a
                          className="btn btn-dark btn-social mx-2"
                          href="#!"
                          aria-label="Parveen Anand LinkedIn Profile"
                        >
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                      </div>
                    </div>
                  );
              })}
            {/* <div className="col-lg-4">
              <div className="team-member">
                <img
                  className="mx-auto rounded-circle"
                  src={tourGuide2}
                  alt="..."
                />
                <h4 className="h4">Diana Petersen</h4>
                <p className="text-muted">Tour Guide</p>
                <a
                  className="btn btn-dark btn-social mx-2"
                  href="#!"
                  aria-label="Diana Petersen Twitter Profile"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  className="btn btn-dark btn-social mx-2"
                  href="#!"
                  aria-label="Diana Petersen Facebook Profile"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  className="btn btn-dark btn-social mx-2"
                  href="#!"
                  aria-label="Diana Petersen LinkedIn Profile"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="team-member">
                <img
                  className="mx-auto rounded-circle"
                  src={tourGuide3}
                  alt="..."
                />
                <h4 className="h4">Larry Parker</h4>
                <p className="text-muted">Tour Guide</p>
                <a
                  className="btn btn-dark btn-social mx-2"
                  href="#!"
                  aria-label="Larry Parker Twitter Profile"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  className="btn btn-dark btn-social mx-2"
                  href="#!"
                  aria-label="Larry Parker Facebook Profile"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  className="btn btn-dark btn-social mx-2"
                  href="#!"
                  aria-label="Larry Parker LinkedIn Profile"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>*/}
          </div>
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <p className="large text-muted">
                Guides publish public tours that tourists can join. Book guides
                and then provide feedback on completed routes
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
