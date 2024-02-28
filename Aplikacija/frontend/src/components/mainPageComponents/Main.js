import React, { useState } from 'react';
import './main-style.css';
import Navbar from './Main_Navbar';
import Masthead from './Main_Masthead';
import Services from './Main_Services';
import MyRoutesGrid from './Main_MyRoutesGrid';
import PublicRoutesGrid from './Main_PublicRoutesGrid';
import FinishedRoutesGrid from './Main_FinishedRoutesGrid';
import TourGuides from './Main_TourGuides';
import Footer from './Main_Footer';
import PublishedRoutesGrid from './Main_PublishedRoutesGrid';
import { extractRoleFromToken } from '../authentication/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Main() {

  const role = extractRoleFromToken();
  const isTourist = role === "turista";
  const isPowerGuideOrAdmin = role === "admin" || role === "power-vodic";

  const navigate = useNavigate();
  const handleShowMarkers = () => {

  };

  return (
    <div id="page-top" className="mainPage-container">
      <Navbar />
      <Masthead />
      <Services />
      <MyRoutesGrid />
      <PublicRoutesGrid />
      {isTourist ? <FinishedRoutesGrid /> : <PublishedRoutesGrid />}
      <TourGuides />
      <Footer />
      {isPowerGuideOrAdmin && (
        <Link to="/pregled-znamenitosti">
          <button className='show-markers-button' onClick={handleShowMarkers}>Show All Markers On The Map</button>
        </Link>
      )}
    </div>
  );
}
