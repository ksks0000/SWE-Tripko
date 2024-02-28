import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from 'react-leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import { useParams } from 'react-router-dom';
import jwtInterceptor from '../authentication/jwtInterceptor';
import './mapa-pretraga-rute-style.css';
import redIcon from '../images/redicon.png';

export default function MapaPretragaRute() {
  const [workingHours, setWorkingHours] = useState([]);
  const [updatedMarkers, setUpdatedMarkers] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [route, setRoute] = useState(null);
  const customIcon = L.icon({
    iconUrl: markerIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: markerShadow,
    shadowSize: [41, 41],
  });
  const customStart = L.icon({
    iconUrl: redIcon,
    iconSize: [40, 41],
    iconAnchor: [18, 41],
    popupAnchor: [1, -34],
    shadowUrl: markerShadow,
    shadowSize: [41, 41],
  });

  const { routeId } = useParams();
  useEffect(() => {
    const url = `http://localhost:5174/Ruta/PreuzmiRutu/${routeId}`;
    jwtInterceptor.get(url).then((response) => {
      setRoute(response.data[0]);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (route != null) {
        const markerIds = route.znamenitosti;
        const promises = markerIds.map(async (idMarkera) => {
          try {
            const znamenitostPromise = jwtInterceptor.get(
              `http://localhost:5174/Znamenitost/PreuzmiZnamenitost/${idMarkera}`
            );
            const znamenitost = await znamenitostPromise;

            const responseWorkingHoursPromise = jwtInterceptor.get(
              `http://localhost:5174/RadnoVreme/PreuzmiRadnoVremeZnamenitosti/${znamenitost.data[0].id}`
            );
            const responseWorkingHours = await responseWorkingHoursPromise;

            return {
              key: znamenitost.data[0].id,
              id: znamenitost.data[0].id,
              naziv: znamenitost.data[0].naziv,
              opis: znamenitost.data[0].opis,
              urlSlike: znamenitost.data[0].urlSlike,
              cena: znamenitost.data[0].cena,
              position: [
                znamenitost.data[0].xCoord,
                znamenitost.data[0].yCoord,
              ],
              workingHoursData: responseWorkingHours.data,
            };
          } catch (error) {
            console.log(error.response.data);
            return null;
          }
        });

        const markers = await Promise.all(promises);
        const filteredMarkers = markers.filter((marker) => marker !== null);

        setMarkers((prev) => [...prev, ...filteredMarkers]);

        const routePoints = filteredMarkers.map((marker) => [
          marker.position[0],
          marker.position[1],
        ]);
        setRoutePoints((prev) => [...prev, ...routePoints]);
      }
    };

    fetchData();
  }, [route]);

  useEffect(() => {
    if (markers.length > 0 && !mapCenter) {
      setMapCenter(markers[0].position);
    }
  }, [markers, mapCenter]);

  return (
    <div className="mapaPretragaRute-container">
      {/* Sidebar Pretrazena Ruta */}
      <div className="sidebar">
        <p>{route !== null ? route.nazivRute : 'Naziv rute'}</p>
        {/* Render info about every fetched marker in the sidebar */}
        {markers.map((marker) => {
          return (
            <div className="prikaz-rute-div-znamenitost">
              <img
                className="prikaz-rute-slika-znamenitost"
                src={marker.urlSlike}
                width={'100%'}
                alt="Slika znamenitosti"
              />
              <div className="naziv">
                <p>{marker.naziv}</p>
              </div>
              <div className="opis">
                <p>{marker.opis}</p>
              </div>
              <div className="cena">
                <p>{marker.cena} dinara</p>
              </div>
              <div className="radno-vreme">
                {marker.workingHoursData.map((workingHour) => {
                  return (
                    <div className="p">
                      {workingHour.dan}{' '}
                      {workingHour.vremeOtvaranja.substring(0, 5)}-
                      {workingHour.vremeZatvaranja.substring(0, 5)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="cenaRute">
        <p>
          Ukupna cena rute:{' '}
          <bold>
            {route && route.cena}
            RSD
          </bold>
        </p>
      </div>

      {/* Map section */}
      {mapCenter && (
        <div style={{ flex: '0 0 75%' }}>
          {/* Render the map with the fetched markers */}
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {markers.length > 0 &&
              markers.map((marker, index) => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  icon={index === 0 ? customStart : customIcon}
                >
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
                    </div>
                  </Popup>
                </Marker>
              ))}
            <Polyline positions={routePoints} />
          </MapContainer>
        </div>
      )}
    </div>
  );
}
