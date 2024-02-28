import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from 'react-leaflet';
import L, { marker } from 'leaflet';
import axios from 'axios';
import SidebarDodavanje from './SidebarDodavanje';
import './dodavanje-rute-style.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import jwtInterceptor from '../authentication/jwtInterceptor';

function DodavanjeRute({
  routeName,
  cityName,
  selectedCity,
  routeStartDate,
  routeEndingDate,
}) {
  const [markers, setMarkers] = useState([]);
  const [markersInRoutes, setMarkersInRoutes] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [cenaRute, setCenaRute] = useState(0);
  const [radnaVremena, setRadnaVremena] = useState([]);
  const [route, setRoute] = useState({
    cityName: '',
    routeName: '',
    startDate: '',
    markerIds: [],
  });
  const [polylineCoords, setPolylineCoords] = useState([]);

  useEffect(
    () =>
      setRoute((prev) => ({
        ...prev,
        cityName: cityName,
        routeName: routeName,
        startDate: routeStartDate,
        endDate: routeEndingDate,
      })),
    []
  );

  useEffect(() => {
    // Fetch markers from the database
    jwtInterceptor
      .get('http://localhost:5174/Znamenitost/PreuzmiZnamenitosti')
      .then((response) => {
        setMarkers(response.data);
      });
  }, []);
  useEffect(() => {
    jwtInterceptor
      .get(`http://localhost:5174/RadnoVreme/PreuzmiRadnaVremena`)
      .then((response) => {
        setRadnaVremena(response.data);
      });
  }, []);
  const customIcon = L.icon({
    iconUrl: markerIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: markerShadow,
    shadowSize: [41, 41],
  });

  const handleMarkerClick = async (marker) => {
    setSelectedMarker(marker);
    await jwtInterceptor
      .get(
        `http://localhost:5174/RadnoVreme/PreuzmiRadnoVremeZnamenitosti/${marker.id}`
      )
      .then((response) => {
        setRadnaVremena((prev) => {
          return [
            ...prev,
            {
              id: marker.id,
            },
          ];
        });
      });
  };

  function addCena(value) {
    console.log(value);
    setCenaRute((prev) => (prev = prev + parseInt(value)));
  }

  const handlePopupButtonClick = (marker) => {
    if (route.markerIds.includes(marker.id)) {
      // Remove the marker ID from the route's markerIds array
      setRoute((prevRoute) => ({
        ...prevRoute,
        markerIds: prevRoute.markerIds.filter((id) => id !== marker.id),
      }));
      // Remove the marker's position from the polyline coordinates
      setPolylineCoords((prevCoords) =>
        prevCoords.filter(
          (coord) => coord[0] !== marker.xCoord && coord[1] !== marker.yCoord
        )
      );
      addCena(-1 * marker.cena);
    } else {
      // Add the marker ID to the route's markerIds array
      setRoute((prevRoute) => ({
        ...prevRoute,
        markerIds: [...prevRoute.markerIds, marker.id],
      }));
      // Add the marker's position to the polyline coordinates
      console.log(marker);
      setPolylineCoords((prevCoords) => [
        ...prevCoords,
        [marker.xCoord, marker.yCoord],
      ]);
      addCena(marker.cena);
    }
  };

  return (
    <div className="dodavanje--container">
      <div className="sidebar">
        <SidebarDodavanje
          route={route}
          onRouteChange={(newRoute) => setRoute(newRoute)}
          markers={markers}
        />
      </div>
      <div className="map-div">
        {selectedCity && (
          <MapContainer
            className="mapa"
            center={[selectedCity.lat, selectedCity.lon]}
            zoom={12}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                id={marker.id}
                position={[marker.xCoord, marker.yCoord]}
                icon={customIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(marker),
                }}
              >
                {selectedMarker === marker && (
                  <Popup>
                    <div className="popup">
                      <img src={marker.urlSlike} width="200px"></img> <br />
                      <p>
                        {' '}
                        <span className="bold">Naziv:</span> {marker.naziv}{' '}
                      </p>
                      <p>
                        {' '}
                        <span className="bold">Opis:</span> {marker.opis}{' '}
                      </p>
                      <p>
                        {' '}
                        <span className="bold">Cena:</span> {marker.cena} dinara{' '}
                      </p>
                      {radnaVremena &&
                        radnaVremena
                          .filter((el) => {
                            return el.znam === selectedMarker.id;
                          })
                          .map((el) => {
                            return (
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  width: '100%',
                                }}
                              >
                                <span style={{ fontWeight: 'bold' }}>
                                  {el.dan}:
                                </span>{' '}
                                <span style={{ alignSelf: 'flex-start' }}>
                                  {el.otvor.substring(0, 5)}-
                                  {el.zatvor.substring(0, 5)}
                                </span>
                              </div>
                            );
                          })}
                      {route.markerIds.includes(marker.id) ? (
                        <button onClick={() => handlePopupButtonClick(marker)}>
                          Remove
                        </button>
                      ) : (
                        <button onClick={() => handlePopupButtonClick(marker)}>
                          Add
                        </button>
                      )}
                    </div>
                  </Popup>
                )}
              </Marker>
            ))}
            {polylineCoords.length > 0 && (
              <Polyline positions={polylineCoords} />
            )}
          </MapContainer>
        )}
      </div>
      <div className="cenaRute">
        <p className="dodavanje-rute-prikaz-cene">
          Ukupna cena rute: {cenaRute} {cenaRute === 1 ? 'dinar' : 'dinara'}
        </p>
      </div>
    </div>
  );
}

export default DodavanjeRute;
