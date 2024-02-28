import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';
import VodicMarker from '../vodicComponents/vodicMarker';
import PowerVodicMarker from '../powerVodicComponents/powerVodicMarker';
import PowerVodicMarkerPregled from '../powerVodicComponents/powerVodicMarkerPregled';
import jwtInterceptor from '../authentication/jwtInterceptor';

//Treba da se ucitaju svi markeri iz baze i da se renderuju odmah na stranici.
//Zatim treba da se omoguci dodavanje markera u bazu podataka jedan po jedan?
//svaki put kad se doda novi marker u bazu, trebalo bi da se osvezi prikaz (kao za notes)
//tako da se na bazi vidi i taj novi dodati marker

function Map(props) {
  const modVodica = props.modVodica;
  const [reFetch, setReFetch] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [showPowerMarker, setShowPowerMarker] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [tags, setTags] = useState();
  const [workingHours, setWorkingHours] = useState([]);
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setCoordinates({ latitude: lat, longitude: lng });
    const newMarker = {
      position: [lat, lng],
    };
    setShowPowerMarker(true);
  };
  useEffect(() => {
    // Fetch markers from the database
    jwtInterceptor
      .get('http://localhost:5174/Znamenitost/PreuzmiZnamenitosti')
      .then((response) => {
        setMarkers(response.data);
        response.data.map(async (znamenitost) => {
          await jwtInterceptor
            .get(
              `http://localhost:5174/RadnoVreme/PreuzmiRadnoVremeZnamenitosti/${znamenitost.id}`
            )
            .then((responseWorkingHours) =>
              setWorkingHours((prev) => {
                return [
                  ...prev,
                  {
                    idZnam: znamenitost.id,
                    workingHoursData: responseWorkingHours.data,
                  },
                ];
              })
            )
            .catch((error) => console.log(error.response.data));
        });
      });
  }, [reFetch]);
  useEffect(() => {
    //Fetch tags from the database
    jwtInterceptor
      .get('http://localhost:5174/Tag/PreuzmiTagove')
      .then((response) => setTags(response.data))
      .catch((error) => console.log(error.response.data));
  }, []);

  function triggerFetch() {
    setReFetch((prev) => !prev);
  }

  function MapClickEvents() {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  }

  function handleMarkerCancel(e) {
    setShowPowerMarker((prev) => !prev);
  }

  function ChangeMapView({ coords }) {
    const map = useMap();

    useEffect(() => {
      if (coords && coords.lat !== null && coords.lon !== null) {
        map.setView(coords, 13); // Set the desired zoom level here
      }
    }, []);

    return null;
  }

  return (
    <div className="map-container">
      <MapContainer center={[43.339677491341725, 21.78735320428259]} zoom={13}>
        <ChangeMapView coords={props.selectedCity} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {props.powerVodic && <MapClickEvents />}
        {showPowerMarker && tags && (
          <PowerVodicMarker
            position={[coordinates.latitude, coordinates.longitude]}
            onMarkerCancel={handleMarkerCancel}
            triggerFetch={triggerFetch}
            tags={tags}
          />
        )}

        {props.powerVodic
          ? markers.map((marker, index) => (
              <PowerVodicMarkerPregled
                key={marker.id}
                index={marker.id}
                position={[marker.xCoord, marker.yCoord]}
                urlSlike={marker.urlSlike}
                naziv={marker.naziv}
                opis={marker.opis}
                cena={marker.cena}
                triggerFetch={triggerFetch}
              />
            ))
          : markers.map((marker, index) => (
              <VodicMarker
                key={marker.id}
                index={marker.id}
                position={[marker.xCoord, marker.yCoord]}
                urlSlike={marker.urlSlike}
                naziv={marker.naziv}
                opis={marker.opis}
                cena={marker.cena}
              />
            ))}
      </MapContainer>
    </div>
  );
}

export default Map;
