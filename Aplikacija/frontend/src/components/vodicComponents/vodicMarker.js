import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

export default function VodicMarker(props) {
  //treba da primim: URL za sliku, Price, Naziv i tip znamenitosti ( *** PREKO PROPS *** )
  const defaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  });

  return (
    <Marker key={props.index} position={props.position} icon={defaultIcon}>
      <Popup style={{ width: "210px" }}>
        <h3 style={{ textAlign: 'center', textWrap: 'wrap' }}> {props.naziv} </h3>
        <img src={props.urlSlike} width="200px" height="100px" />
        <br />

        <div style={{ textWrap: 'wrap' }}><span style={{ fontWeight: 'bold' }}>Description:</span> {props.opis}</div>
        <div><span style={{ fontWeight: 'bold' }}>Price: </span>{props.cena} RSD </div>
        <br />
      </Popup>
    </Marker>
  );
}
