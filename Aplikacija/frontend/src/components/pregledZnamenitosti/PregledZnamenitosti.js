import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Map from './Map';
import "./PregledZnamenitosti-style.css"

export default function PregledZnamenitosti() {
  const [powerVodic, setPowerVodic] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  function togglePowerVodic() {
    setPowerVodic((prev) => !prev);
    console.log('Clicked', !powerVodic);
  }

  function handleCityCoordinates(lat, lon) {
    setSelectedCity({ lat, lon });
  }

  return (
    <div className='pregledZnamenitosti-container'>
      <button
        className={`dodavanjeMarkera--button${powerVodic ? 'Toggled' : ''} `}
        onClick={() => togglePowerVodic()}
      >
        Toggle Adding/Changing monuments regime
      </button>
      <div className="pretraga">
        <Sidebar handleCityCoordinates={handleCityCoordinates} />
      </div>
      <div className="mapa">
        <Map powerVodic={powerVodic} selectedCity={selectedCity} />
      </div>
    </div>
  );
}
