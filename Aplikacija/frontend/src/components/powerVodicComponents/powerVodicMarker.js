import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import './power-vodic-marker-style.css';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import jwtInterceptor from '../authentication/jwtInterceptor';

export default function PowerVodicMarker(props) {
  const [isVisible, setIsVisible] = useState(true);
  const [checkedTags, setCheckedTags] = useState([]);
  const [markerData, setMarkerData] = useState({
    naziv: '',
    opis: '',
    cena: 0,
    coorX: props.position[0],
    coorY: props.position[1],
    slikaUrl: '',
  });
  const [radnaVremena, setRadnaVremena] = useState({
    timeRDod: '00:00',
    timeRDdo: '00:00',
    timeSod: '00:00',
    timeSdo: '00:00',
  });
  const defaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  });
  console.log(props.tags);
  const handleCancel = (e) => {
    e.stopPropagation();
    props.onMarkerCancel(e);
  };

  const addWorkingHours = async (dan, idZnam) => {
    try {
      await jwtInterceptor
        .post(
          `http://localhost:5174/RadnoVreme/KreirajRadnoVreme/${dan}/${dan < 6 ? `${radnaVremena.timeRDod}` : `${radnaVremena.timeSod}`
          }/${dan < 6 ? `${radnaVremena.timeRDdo}` : `${radnaVremena.timeSdo}`
          }/${idZnam}`
        )
        .catch((error) => console.log(error.response.data));
    } catch (error) { }
  };

  const handleSave = async (e) => {
    props.onMarkerCancel();
    const { naziv, opis, cena, coorX, coorY, slikaUrl } = markerData;

    const url = `http://localhost:5174/Znamenitost/DodajZnamenitost/${naziv}/${opis}/${cena}/${coorX}/${coorY}?slikaUrl=${slikaUrl}`;
    jwtInterceptor
      .post(url)
      .then(async (response) => {
        console.log('Uspesno', response.data.split(' ')[5]);
        const idZ = response.data.split(' ')[5];
        checkedTags.map(async (idK) => {
          await jwtInterceptor
            .put(
              `http://localhost:5174/Znamenitost/PripadaKategoriji/${idZ}/${idK}`
            )
            .then((response) => {
              console.log(response.data);
            });
        });
        for (let i = 0; i < 6; i++) {
          await addWorkingHours(i + 1, idZ);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      });

    setTimeout(() => props.triggerFetch(), 1500);
  };

  function handleOnChange(e) {
    setMarkerData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
    console.log(markerData);
  }

  if (!isVisible) {
    return null; // Don't render the marker if it's deleted
  }
  function checkOrUncheckTag(event, tagId) {
    const isChecked = event.target.checked;
    if (isChecked) {
      // Add the tagId to the checkedTags array
      setCheckedTags((prevCheckedTags) => [...prevCheckedTags, tagId]);
    } else {
      // Remove the tagId from the checkedTags array
      setCheckedTags((prevCheckedTags) =>
        prevCheckedTags.filter((id) => id !== tagId)
      );
    }
  }
  function handlePromenuRadnogVremena(event) {
    setRadnaVremena((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }
  return (
    <Marker key={props.index} position={props.position} icon={defaultIcon}>
      <Popup>
        <form onSubmit={handleSave}>
          <div className="power-vodic-marker-popup">
            <div>
              <div>
                <h4>Adding monument</h4>
                <label htmlFor="naziv">Monument title:</label>
                <br />
                <input
                  type="text"
                  id="naziv"
                  name="naziv"
                  value={markerData.naziv}
                  onChange={handleOnChange}
                />
                <br />
                <br />
                <label htmlFor="opis">Description: </label>
                <br />
                <input
                  type="text"
                  id="opis"
                  name="opis"
                  value={markerData.opis}
                  onChange={handleOnChange}
                />
                <br />
                <br />
                <label htmlFor="cena">Ticket price:</label>
                <br />
                <input
                  type="text"
                  id="cena"
                  name="cena"
                  value={markerData.cena}
                  onChange={handleOnChange}
                />
                <br />
                <br />
                <label htmlFor="slikaUrl">Picture URL:</label>
                <br />
                <input
                  type="text"
                  id="slikaUrl"
                  name="slikaUrl"
                  value={markerData.slikaUrl}
                  onChange={handleOnChange}
                />
                <br />
              </div>
              <div>
                <br />
                {!props.modVodica && (
                  <button type="button" onClick={handleCancel}>
                    Cancel
                  </button>
                )}
                {!props.modVodica && <button>Save</button>}
              </div>
              <div>
                <div>X: {props.position[0]}</div>
                <div>Y: {props.position[1]}</div>
              </div>
            </div>
            <div>
              <div className="power-vodic-marker-div-checkbox">
                {props.tags.map((tag) => {
                  return (
                    <div>
                      <input
                        key={tag.id}
                        type="checkbox"
                        id={`checkbox${tag.id}`}
                        name={`checkbox${tag.id}`}
                        onChange={(event) => checkOrUncheckTag(event, tag.id)}
                        checked={checkedTags.includes(tag.id)}
                      ></input>
                      <label htmlFor={`checkbox${tag.id}`}>
                        {tag.kategorija}
                      </label>{' '}
                    </div>
                  );
                })}
              </div>
              <div>
                <div>Working hours on working days:</div>
                <input
                  type="time"
                  name="timeRDod"
                  onChange={handlePromenuRadnogVremena}
                  value={radnaVremena.timeRDod}
                />
                <input
                  type="time"
                  name="timeRDdo"
                  onChange={handlePromenuRadnogVremena}
                  value={radnaVremena.timeRDdo}
                />
                <br />
                <div>Working hours on Saturday:</div>
                <input
                  type="time"
                  name="timeSod"
                  onChange={handlePromenuRadnogVremena}
                  value={radnaVremena.timeSod}
                />
                <input
                  type="time"
                  name="timeSdo"
                  onChange={handlePromenuRadnogVremena}
                  value={radnaVremena.timeSdo}
                />
              </div>
            </div>
          </div>
        </form>
      </Popup>
    </Marker>
  );
}
