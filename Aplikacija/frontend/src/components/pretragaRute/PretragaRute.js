import React, { useEffect, useState } from 'react';
import SidebarPretragaRute from './SidebarPretragaRute';
import MainPretragaRute from './MainPretragaRute';
import jwtInterceptor from '../authentication/jwtInterceptor';
import { useParams } from 'react-router-dom';

function PretragaRute({ renderPretragaRuteMap }) {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);

  const { tipRuta } = useParams();

  useEffect(() => {
    if (tipRuta === 'javna') {
      jwtInterceptor
        .get('http://localhost:5174/Ruta/PreuzmiSveJavneRute')
        .then((fetchedRoutes) => {
          setRoutes(fetchedRoutes.data);
          setFilteredRoutes(fetchedRoutes.data);
        })
        .catch((error) => {
          console.log('Error fetching routes:', error);
        });
    } else if (tipRuta === 'privatna') {
      jwtInterceptor
        .get('http://localhost:5174/Ruta/PreuzmiPrivatneRuteKorisnika')
        .then((fetchedRoutes) => {
          setRoutes(fetchedRoutes.data);
          setFilteredRoutes(fetchedRoutes.data);
        })
        .catch((error) => {
          console.log('Error fetching routes:', error);
        });
    } else if (tipRuta === 'zavrsena') {
      jwtInterceptor
        .get('http://localhost:5174/Ruta/PreuzmiRezervisaneRuteKorisnika')
        .then((fetchedRoutes) => {
          setRoutes(fetchedRoutes.data[0]);
          setFilteredRoutes(fetchedRoutes.data[0]);
        })
        .catch((error) => {
          console.log('Error fetching routes:', error);
        });
    } else if (tipRuta === 'objavljena') {
      jwtInterceptor
        .get('http://localhost:5174/Ruta/PreuzmiJavneRuteKorisnika')
        .then((fetchedRoutes) => {
          setRoutes(fetchedRoutes.data);
          setFilteredRoutes(fetchedRoutes.data);
        })
        .catch((error) => {
          console.log('Error fetching routes:', error);
        });
    }
  }, [tipRuta]);

  return (
    <div className="prtragaRute-container">
      <div className="sidebar">
        <SidebarPretragaRute
          routes={routes}
          setRoutes={setRoutes}
          setFilteredRoutes={setFilteredRoutes}
          tipRuta={tipRuta}
        />
      </div>
      <div className="main">
        <MainPretragaRute
          routes={filteredRoutes}
          renderPretragaRuteMap={renderPretragaRuteMap}
          tipRuta={tipRuta}
        />
      </div>
    </div>
  );
}

export default PretragaRute;
