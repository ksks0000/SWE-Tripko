import React, { useState } from 'react';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { Marker, Popup } from 'react-leaflet';
import jwtInterceptor from '../authentication/jwtInterceptor';

export default function VodicMarker(props) {
  const [izmenaMarkera, setIzmenaMarkera] = useState(false);
  const [dataForm, setDataForm] = useState({
    id: props.index,
    naziv: props.naziv,
    opis: props.opis,
    cena: props.cena,
    x: props.position[0],
    y: props.position[1],
    slikaUrl: props.urlSlike,
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
  function handleOnChange(e) {
    setDataForm((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }
  const addWorkingHours = async (dan, idZnam) => {
    try {
      await jwtInterceptor.post(
        `http://localhost:5174/RadnoVreme/KreirajRadnoVreme/${dan}/${dan < 6
          ? encodeURIComponent(`${radnaVremena.timeRDod}`)
          : encodeURIComponent(`${radnaVremena.timeSod}`)
        }/${dan < 6
          ? encodeURIComponent(`${radnaVremena.timeRDdo}`)
          : encodeURIComponent(`${radnaVremena.timeSdo}`)
        }/${idZnam}`
      );
    } catch (error) {
      console.error(error);
    }
  };
  async function handleSaveChanges(e) {
    e.preventDefault();
    const { id, naziv, opis, cena, x, y, slikaUrl } = dataForm;
    const url = `http://localhost:5174/Znamenitost/IzmeniZnamenitost/${id}/${naziv}/${opis}/${cena}/${x}/${y}?slikaUrl=${slikaUrl}`;
    await jwtInterceptor
      .put(url)
      .then((response) => {
        console.log('Uspesno', response);
      })
      .catch((error) => {
        console.log(error.response.data);
      });

    setTimeout(() => {
      props.triggerFetch();
      setIzmenaMarkera((prev) => !prev);
    }, 1500);
  }

  function handleMarkerDelete() {
    const url = `http://localhost:5174/Znamenitost/ObrisiZnamenitost/${props.index}`;
    jwtInterceptor.delete(url);
    setTimeout(() => props.triggerFetch(), 1500);
  }
  function handlePromenuRadnogVremena(event) {
    setRadnaVremena((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }
  return (
    <Marker key={props.index} position={props.position} icon={defaultIcon}>
      {!izmenaMarkera ? (
        <Popup>
          <div>
            <h3 style={{ textAlign: 'center', textWrap: 'wrap' }}> {props.naziv} </h3>
            <img src={props.urlSlike} width="200px" height="100px" />
            <br />
            <div style={{ textWrap: 'wrap' }}><span style={{ fontWeight: 'bold' }}>Description:</span> {props.opis}</div>
            <div><span style={{ fontWeight: 'bold' }}>Price: </span>{props.cena} RSD </div>
          </div>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginTop: '10px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIzmenaMarkera((prev) => !prev);
              }}
              style={{ width: '45%' }}
            >
              Change
            </button>
            <button onClick={handleMarkerDelete} style={{ width: '45%' }}>Delete</button>
          </div>
        </Popup>
      ) : (
        <Popup>
          <form onSubmit={handleSaveChanges}>
            <div>
              <h4>Marker change</h4>
              <label htmlFor="naziv">Monument title:</label>
              <br />
              <input
                type="text"
                id="naziv"
                name="naziv"
                value={dataForm.naziv}
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
                value={dataForm.opis}
                onChange={handleOnChange}
              />
              <br />
              <br />
              <label htmlFor="cena">Price:</label>
              <br />
              <input
                type="number"
                id="cena"
                name="cena"
                value={dataForm.cena}
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
                value={dataForm.slikaUrl}
                onChange={handleOnChange}
              />
              <br />
            </div>
            <div>
              <br />
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <button>Save changes</button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIzmenaMarkera((prev) => !prev);
                  }}
                >
                  Cancel
                </button>

              </div>
            </div>
          </form>
        </Popup>
      )}
    </Marker>
  );
}
