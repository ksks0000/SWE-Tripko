import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import DodavanjeRute from './DodavanjeRute';
import './preDodavanjaRute-style.css';
import img from '../images/preCreateRoute.jpg';
import logo from '../images/navbar-logo.png';
import { useNavigate } from 'react-router-dom';

function PreDodavanjeRute({ handleRouteCreation }) {
  const [selectedCity, setSelectedCity] = useState(null);
  const [routeName, setRouteName] = useState('');
  const [routeStartDate, setRouteStartDate] = useState('');
  const [routeEndingDate, setRouteEndingDate] = useState('');
  const [showDodavanjeRute, setShowDodavanjeRute] = useState(false);

  const navigate = useNavigate();
  const redirectToMainPage = () => {
    navigate('/main-page');
  };

  const loadOptions = async (inputValue) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${inputValue}`
      );
      if (response.data) {
        const options = response.data.map((result) => ({
          value: result.display_name,
          label: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
        }));
        return options;
      }
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
    return [];
  };

  const handleCitySelect = (selectedOption) => {
    setSelectedCity(selectedOption);
  };

  const handleCreateRoute = () => {
    if (
      selectedCity !== null &&
      routeName &&
      routeEndingDate &&
      routeStartDate
    ) {
      setShowDodavanjeRute(true);
    } else {
      alert('Unesite sve podatke prvo!');
    }
  };

  return (
    <div>
      {!showDodavanjeRute || !selectedCity ? (
        <div className="preDodavanjaRute-container">
          <a onClick={redirectToMainPage} class="previous round">
            &#8249; Back
          </a>
          <div className="input-div">
            <h3 className="h3">
              Create your <span className="route-word">route</span>
            </h3>
            <div className="city-div">
              <p>City</p>
              <AsyncSelect
                className="city-select"
                cacheOptions
                loadOptions={loadOptions}
                placeholder="Search for a city..."
                value={selectedCity}
                onChange={handleCitySelect}
              />
            </div>
            <div className="routeName-div">
              <p>Route Name</p>
              <input
                type="text"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
              />
            </div>
            <div className="routeDate-div">
              <p>Route Start Date</p>
              <input
                type="date"
                value={routeStartDate}
                onChange={(e) => setRouteStartDate(e.target.value)}
              />
            </div>
            <div className="routeEndDate-div">
              <p>Route End Date</p>
              <input
                type="date"
                value={routeEndingDate}
                onChange={(e) => setRouteEndingDate(e.target.value)}
              />
            </div>
            <button className="createRoute-button" onClick={handleCreateRoute}>
              Create Route
            </button>
          </div>
          <div className="image-div">
            <div className="logo-div">
              <img src={logo} />
            </div>
            <img src={img} />
          </div>
        </div>
      ) : (
        selectedCity && (
          <DodavanjeRute
            selectedCity={selectedCity}
            cityName={selectedCity.value.split(/,| /)[0]}
            routeName={routeName}
            routeStartDate={routeStartDate}
            routeEndingDate={routeEndingDate}
            handleRouteCreation={handleRouteCreation}
          />
        )
      )}
    </div>
  );
}

export default PreDodavanjeRute;
