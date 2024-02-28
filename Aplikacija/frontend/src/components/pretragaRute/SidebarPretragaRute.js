import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import './pretraga-rute-style.css';
import logo from '../images/navbar-logo.png';
import jwtInterceptor from '../authentication/jwtInterceptor';

function SidebarPretragaRute({
  routes,
  setFilteredRoutes,
  tipRuta,
  setRoutes,
}) {
  const [searchInput, setSearchInput] = useState('');
  const [guideInput, setGuideInput] = useState('');
  const [monumentTypes, setMonumentTypes] = useState([]);
  const [tags, setTags] = useState([]);
  const [sortDate, setSortDate] = useState(false);
  const [sortPrice, setSortPrice] = useState(false);
  const [sortRating, setSortRating] = useState(false);

  useEffect(() => {
    // Filter routes based on the search input, guide input, and selected monument types
    const filteredRoutes = routes.filter(
      (route) =>
        route.nazivRute.toLowerCase().includes(searchInput.toLowerCase()) &&
        route.imeVodica.toLowerCase().includes(guideInput.toLowerCase()) &&
        (monumentTypes.length === 0 ||
          route.tagovi.some((type) => monumentTypes.includes(type[0])))
    );
    setFilteredRoutes(filteredRoutes);
  }, [searchInput, guideInput, monumentTypes, routes, setFilteredRoutes]);

  const handleSearchInputChange = (event, { newValue }) => {
    setSearchInput(newValue);
  };

  const handleGuideInputChange = (event, { newValue }) => {
    setGuideInput(newValue);
  };

  const handleMonumentTypeChange = (event) => {
    const type = event.target.value;
    const updatedMonumentTypes = [...monumentTypes];

    if (event.target.checked) {
      updatedMonumentTypes.push(type);
    } else {
      const index = updatedMonumentTypes.indexOf(type);
      if (index > -1) {
        updatedMonumentTypes.splice(index, 1);
      }
    }

    setMonumentTypes(updatedMonumentTypes);
  };

  useEffect(() => {
    //Fetch tags from the database
    jwtInterceptor
      .get('http://localhost:5174/Tag/PreuzmiTagove')
      .then((response) => setTags(response.data))
      .catch((error) => console.log(error.response.data));
  }, []);

  const getSuggestions = (value, key) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : routes
        .filter((route) => route[key].toLowerCase().includes(inputValue))
        .map((route) => ({ name: route[key] }));
  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

  const inputProps = (placeholder, value, onChange) => ({
    placeholder,
    value,
    onChange,
  });

  const nameSuggestions = getSuggestions(searchInput, 'nazivRute');
  const guideSuggestions = getSuggestions(guideInput, 'imeVodica');

  //SORT BY DATE
  function handleSortByDate() {
    if (tipRuta === 'privatna') {
      jwtInterceptor
        .get(
          'http://localhost:5174/SortiranjeRuta/SortirajPrivatneKorisnikaPoDatumu'
        )
        .then((fetchedRoutes) => {
          console.log(fetchedRoutes.data);
          setRoutes(fetchedRoutes.data);
          setFilteredRoutes(fetchedRoutes.data);
        })
        .catch((error) => {
          console.log('Error fetching routes:', error);
        });
    } else if (tipRuta === 'javna') {
      jwtInterceptor
        .get('http://localhost:5174/SortiranjeRuta/SortirajJavnePoDatumu')
        .then((fetchedRoutes) => {
          console.log(fetchedRoutes.data);
          setRoutes(fetchedRoutes.data);
          setFilteredRoutes(fetchedRoutes.data);
        })
        .catch((error) => {
          console.log('Error fetching routes:', error);
        });
    } else if (tipRuta === 'zavrsena') {
      jwtInterceptor
        .get('http://localhost:5174/SortiranjeRuta/SortirajRezervisanePoDatumu')
        .then((fetchedRoutes) => {
          console.log(fetchedRoutes.data[0]);
          setRoutes(fetchedRoutes.data[0]);
          setFilteredRoutes(fetchedRoutes.data[0]);
        })
        .catch((error) => {
          console.log('Error fetching routes:', error);
        });
    } else if (tipRuta === 'objavljena') {
      jwtInterceptor
        .get(
          'http://localhost:5174/SortiranjeRuta/SortirajJavneKorisnikaPoDatumu'
        )
        .then((fetchedRoutes) => {
          console.log(fetchedRoutes.data[0]);
          setRoutes(fetchedRoutes.data[0]);
          setFilteredRoutes(fetchedRoutes.data[0]);
        })
        .catch((error) => {
          console.log('Error fetching routes:', error);
        });
    }
  }

  //SORT BY PRICE
  function handleSortByPrice() {
    if (tipRuta === 'privatna') {
      setSortPrice((prev) => !prev);
      jwtInterceptor
        .get(
          `http://localhost:5174/SortiranjeRuta/SortirajPrivatneKorisnikaPoCeni${sortPrice ? 'Rastuce' : 'Opadajuce'
          }`
        )
        .then((fetchedRoutes) => {
          console.log(fetchedRoutes.data);
          setRoutes(fetchedRoutes.data);
          setFilteredRoutes(fetchedRoutes.data);
        })
        .catch((error) => {
          console.log('Error fetching routes:', error);
        });
    } else if (tipRuta === 'javna') {
      setSortPrice((prev) => !prev);
      jwtInterceptor
        .get(
          `http://localhost:5174/SortiranjeRuta/SortirajSveJavnePoCeni${sortPrice ? 'Rastuce' : 'Opadajuce'
          }`
        )
        .then((fetchedRoutes) => {
          console.log(fetchedRoutes.data);
          setRoutes(fetchedRoutes.data);
          setFilteredRoutes(fetchedRoutes.data);
        })
        .catch((error) => {
          console.log('Error fetching routes:', error);
        });
    } else if (tipRuta === 'zavrsena') {
      setSortPrice((prev) => !prev);
      jwtInterceptor
        .get(
          `http://localhost:5174/SortiranjeRuta/SortirajRezervisanePoCeni${sortPrice ? 'Rastuce' : 'Opadajuce'
          }`
        )
        .then((fetchedRoutes) => {
          console.log(fetchedRoutes.data[0]);
          setRoutes(fetchedRoutes.data[0]);
          setFilteredRoutes(fetchedRoutes.data[0]);
        })
        .catch((error) => {
          console.log('Error fetching routes:', error);
        });
    } else if (tipRuta === 'objavljena') {
      setSortPrice((prev) => !prev);
      jwtInterceptor
        .get(
          `http://localhost:5174/SortiranjeRuta/SortirajJavneKorisnikaPoCeni${sortPrice ? 'Rastuce' : 'Opadajuce'
          }`
        )
        .then((fetchedRoutes) => {
          console.log(fetchedRoutes.data[0]);
          setRoutes(fetchedRoutes.data[0]);
          setFilteredRoutes(fetchedRoutes.data[0]);
        })
        .catch((error) => {
          console.log('Error fetching routes:', error);
        });
    }
  }

  //SORT BY ROUTE RATING
  function handleSortByRating() {
   /* if (tipRuta === 'privatna') {
      setSortRating((prev) => !prev);
      jwtInterceptor
        .get(
          `http://localhost:5174/SortiranjeRuta/SortirajPrivatneKorisnikaPoOceniRute`
        )
        .then((fetchedRoutes) => {
          console.log(fetchedRoutes.data);
          // setRoutes(fetchedRoutes.data[0]);
          // setFilteredRoutes(fetchedRoutes.data[0]);
        })
        .catch((error) => {
          console.log('Error fetching routes:', error);
        });
    } else */ if (tipRuta === 'javna') {
      setSortRating((prev) => !prev);
      jwtInterceptor
        .get(`http://localhost:5174/SortiranjeRuta/SortirajSveJavnePoOceniRute`)
        .then((fetchedRoutes) => {
          console.log(fetchedRoutes.data);
          setRoutes(fetchedRoutes.data);
          setFilteredRoutes(fetchedRoutes.data);
        })
        .catch((error) => {
          console.log('Error fetching routes:', error);
        });
    } else if (tipRuta === 'zavrsena') {
      setSortRating((prev) => !prev);
      jwtInterceptor
        .get(
          `http://localhost:5174/SortiranjeRuta/SortirajRezervisanePoOceniRute`
        )
        .then((fetchedRoutes) => {
          console.log(fetchedRoutes.data[0]);
          setRoutes(fetchedRoutes.data[0]);
          setFilteredRoutes(fetchedRoutes.data[0]);
        })
        .catch((error) => {
          console.log('Error fetching routes:', error);
        });
    } else if (tipRuta === 'objavljena') {
      setSortRating((prev) => !prev);
      jwtInterceptor
        .get(
          `http://localhost:5174/SortiranjeRuta/SortirajJavneKorisnikaPoOceniRute`
        )
        .then((fetchedRoutes) => {
          console.log(fetchedRoutes.data[0]);
          setRoutes(fetchedRoutes.data[0]);
          setFilteredRoutes(fetchedRoutes.data[0]);
        })
        .catch((error) => {
          console.log('Error fetching routes:', error);
        });
    }
  }

  return (
    <div className="pretraga--sidebar">
      <div className="zaSenku">
        <div className="logo">
          <img src={logo} alt="Tripko"></img>
        </div>
        <div className="poImenuRute">
          <h2>Search by Route Name:</h2>
          <Autosuggest
            suggestions={nameSuggestions}
            onSuggestionsFetchRequested={() => { }}
            onSuggestionsClearRequested={() => { }}
            onSuggestionSelected={() => { }}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps(
              'Search by route name',
              searchInput,
              handleSearchInputChange
            )}
          />
        </div>
        {(tipRuta === 'javna' || tipRuta === 'zavrsena') && (
          <div className="poImenuVodica">
            <h2>Search by Guide:</h2>
            <Autosuggest
              suggestions={guideSuggestions}
              onSuggestionsFetchRequested={() => { }}
              onSuggestionsClearRequested={() => { }}
              onSuggestionSelected={() => { }}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps(
                'Search by guide',
                guideInput,
                handleGuideInputChange
              )}
            />
          </div>
        )}
        <div className="poZnamenitosti">
          <h2>Filter by Monument Type:</h2>
          <div className="pretraga-div-checkbox">
            {tags.map((tag) => (
              <div>
                <input
                  type="checkbox"
                  id={tag.kategorija}
                  value={tag.kategorija}
                  onChange={handleMonumentTypeChange}
                />
                <label for={tag.kategorija}>{tag.kategorija}</label>
              </div>
            ))}
          </div>
        </div>
        {tipRuta !== 'objavljena' && (
          <div className='sort'>
            <h2>Sort routes:</h2>
            <div onClick={handleSortByDate}>
              Sort routes by date closest
            </div>
            {(tipRuta !== 'privatna') &&
              <div onClick={handleSortByRating}>
                Sort routes by rating descending
              </div>
            }
            <div onClick={handleSortByPrice}>
              Sort routes by price {!sortPrice ? 'ascending' : 'descending'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SidebarPretragaRute;
