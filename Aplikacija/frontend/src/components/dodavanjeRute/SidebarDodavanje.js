import React, { useState } from 'react';
import './sidebarDodavanje-style.css';
import jwtInterceptor from '../authentication/jwtInterceptor';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/navbar-logo.png';

function SidebarDodavanje({ route, markers }) {
  //U Route svi neophodni podaci da se kreira ruta: datum, kraj, naziv (preko path)
  const [submitovana, setSubmitovana] = useState(false);
  //U route (markerIDs) svi neophodni ID-evi da bi se ruti dodale posete

  const navigate = useNavigate();

  async function submitRoute() {
    if (route.markerIds.length > 0) {
      if (!submitovana) {
        route.startDate += 'T00:00:00.001Z';
        route.endDate += 'T00:00:00.001Z';
        setSubmitovana((prev) => !prev);
      }
      const url = `http://localhost:5174/Ruta/KreirajRutu/${route.startDate}/${
        route.endDate
      }/${encodeURIComponent(route.routeName)}`;

      jwtInterceptor
        .post(url)
        .then((response) => {
          const idRute = parseInt(response.data.split(' ')[5]);
          route.markerIds.map(async (id) => {
            jwtInterceptor
              .post(`http://localhost:5174/Ruta/DodajPosetu/${idRute}/${id}`)
              .then((response) => {
                console.log(response.data);
                navigate('/main-page');
              })
              .catch((e) => console.log(e.response.data));
          });
        })
        .catch((error) => {
          console.log('Error:', error.response);
          console.log('Status:', error.response.status);
          console.log('Data:', error.response.data);
          console.log('Headers:', error.response.headers);
          console.log('Config:', error.response.config);
        });
    } else {
      alert('Odaberite znamenitosti');
    }
  }

  return (
    <div className="slidebarDodavanje-container">
      <div className="logo-div">
        <img src={logo} alt="logo"></img>
      </div>
      <h3>{route.routeName}</h3>
      <div className="markeri">
        {route.markerIds.map((id) => {
          return (
            <div>
              {markers
                .filter((marker) => marker.id === id)
                .map((marker) => (
                  <div>
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
                      <div className="cena">
                        <p>{marker.cena} dinara</p>
                      </div>
                      <div className="opis">
                        <p>{marker.opis}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
      <div className="create-route-div">
        {/*<Link to="/main-page">*/}
        <button className="sidebar-dodavanje-button" onClick={submitRoute}>
          Create route
        </button>
      </div>
      {/*</Link>*/}
    </div>
  );
}

export default SidebarDodavanje;
