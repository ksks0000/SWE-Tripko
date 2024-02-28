import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';

function Sidebar({ handleCityCoordinates }) {
  const [selectedCity, setSelectedCity] = useState(null);

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
    const { lat, lon } = selectedOption;
    handleCityCoordinates(lat, lon);
    setTimeout(() => {
      handleCityCoordinates(null, null);
    }, 1000);
  };

  return (
    <div className="sidebar">
      <h3>Select City</h3>
      <AsyncSelect
        className='select'
        cacheOptions
        loadOptions={loadOptions}
        placeholder="Search for a city..."
        value={selectedCity}
        onChange={handleCitySelect}
      />
    </div>
  );
}

export default Sidebar;
