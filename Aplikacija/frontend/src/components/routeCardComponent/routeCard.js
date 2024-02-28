import React, { useEffect } from 'react';
import './routeCard-style.css';
import ReactStars from 'react-rating-stars-component';
import img from '../images/header-bg4.jpg';
import imgc from '../images/profile-image.jpg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtInterceptor from '../authentication/jwtInterceptor';
import { extractRoleFromToken } from '../authentication/AuthContext';

export default function RouteCard(props) {
  const [isPublicRoute, setIsPublicRoute] = useState(props.isPublicRoute);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isPublishPopupOpen, setIsPublishPopupOpen] = useState(false);
  const [isFinishedRoute, setIsFinishedRoute] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(props.isSubscribed);
  const [prosecnaOcenaVodica, setProsecnaOcenaVodica] = useState(null);
  const [profilnaSlika, setProfilnaSlika] = useState(imgc);
  const [kapacitet, setKapacitet] = useState(10);
  const [procenatZarade, setProcenatZarade] = useState(10);
  const [datumPocetka, setDatumPocetka] = useState(null);
  const [datumKraja, setDatumKraja] = useState(null);
  const [slicka, setSlicka] = useState(null);
  const [organizovanostRating, setOrganizovanostRating] = useState(0);
  const [bezbednostRating, setBezbednostRating] = useState(0);
  const [odnosCeneIKvalitetaRating, setOdnosCeneIKvalitetaRating] = useState(0);
  const [osimisljeniProgramRating, setOsimisljeniProgramRating] = useState(0);
  const [oceniVodica, setOceniVodica] = useState(0);

  const [ruta, setRuta] = useState(null);
  const role = extractRoleFromToken();
  const isTourist = role === 'turista';

  useEffect(() => {
    if (new Date(props.kraj.split('T')[0]) < new Date()) {
      setIsFinishedRoute(true);
    }
  }, []);
  useEffect(() => {
    jwtInterceptor
      .get(`http://localhost:5174/Ruta/PreuzmiRutu/${props.id}`)
      .then((response) => {
        if (
          response.data[0].znamenitosti[0] !== undefined &&
          response.data[0].znamenitosti[0] !== null
        ) {
          jwtInterceptor
            .get(
              `http://localhost:5174/Znamenitost/PreuzmiZnamenitost/${response.data[0].znamenitosti[0]}`
            )
            .then((response) => {
              setSlicka(response.data[0].urlSlike);
            });
        }
      });
  }, []);
  const openPopup = () => {
    setPopupOpen(!isPopupOpen);
  };

  const openPublishPopup = () => {
    setIsPublishPopupOpen(!isPublishPopupOpen);
  };

  const handleKapacitetChange = (event) => {
    setKapacitet(event.target.value);
  };

  const handleProcenatZaradeChange = (event) => {
    setProcenatZarade(event.target.value);
  };

  const handleOrganizovanostRatingChange = (newRating) => {
    setOrganizovanostRating(newRating);
  };

  const handleBezbednostRatingChange = (newRating) => {
    setBezbednostRating(newRating);
  };

  const handleOdnosCeneIKvalitetaRatingChange = (newRating) => {
    setOdnosCeneIKvalitetaRating(newRating);
  };

  const handleOsimisljeniProgramRatingChange = (newRating) => {
    setOsimisljeniProgramRating(newRating);
  };

  const handleSubmitRatings = () => {
    if (
      organizovanostRating > 0 &&
      bezbednostRating > 0 &&
      odnosCeneIKvalitetaRating > 0 &&
      osimisljeniProgramRating > 0
    ) {
      jwtInterceptor
        .post(
          `http://localhost:5174/Turista/OceniRutu/${props.id}
          /${organizovanostRating}
          /${bezbednostRating}
          /${odnosCeneIKvalitetaRating}
          /${osimisljeniProgramRating}`
        )
        .then((response) => console.log(response.data))
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert('Please select all ratings');
    }
  };

  const handleRateGuide = (newRating) => {
    setOceniVodica(newRating);
    jwtInterceptor
      .post(
        `http://localhost:5174/Turista/OceniVodica/${props.idVodica}/${oceniVodica}/${oceniVodica}/${oceniVodica}/${oceniVodica}/${oceniVodica}/" "`
      )
      .then((response) => console.log(response.data))
      .catch((error) => {
        console.error(error);
      });
  };

  const navigate = useNavigate();
  const handleShowRoute = () => {
    navigate(`/main-page/pretraga-rute/pretrazena-ruta-mapa/${props.id}`);
  };

  const handleDeleteRoute = () => {
    const url = `http://localhost:5174/Ruta/ObrisiRutu/${props.id}`;
    jwtInterceptor
      .delete(url)
      .then((response) => { })
      .catch((error) => {
        console.error(error.response.data);
      });
    setTimeout(() => {
      window.location.reload(false);
    }, 2000);
  };

  const handleSubscribeToRoute = () => {
    const url = `http://localhost:5174/Ruta/RezervisiRutu/${props.id}`;
    jwtInterceptor
      .put(url)
      .then((response) => { })
      .catch((error) => {
        console.error(error.response.data);
      });
    setTimeout(() => {
      window.location.reload(false);
    }, 1500);
  };

  const handleUnsubscribeFromRoute = () => {
    const url = `http://localhost:5174/Ruta/OtkaziRezervacijuRute/${props.id}`;
    jwtInterceptor
      .put(url)
      .then((response) => { })
      .catch((error) => {
        console.error(error.response.data);
      });
    setTimeout(() => {
      window.location.reload(false);
    }, 1500);
  };

  const handlePublishRoute = () => {
    // event.preventDefault();
    const url = `http://localhost:5174/Ruta/OglasiRutu/${props.id}/${kapacitet}/${procenatZarade}/${datumPocetka}T07:28:26.081Z/${datumKraja}T07:28:26.081Z`;
    jwtInterceptor
      .post(url)
      .then((response) => { window.location.reload(false); })
      .catch((error) => {
        console.error(error.response.data);
      });
    // setTimeout(() => {
    //   window.location.reload(false);
    // }, 5000);
  };

  const handleUnpublishRoute = () => {
    const url = `http://localhost:5174/Ruta/ProglasiRutuPrivatnom/${props.id}`;
    jwtInterceptor
      .post(url)
      .then((response) => { window.location.reload(false); })
      .catch((error) => {
        console.error(error.response.data);
      });
    // setTimeout(() => {
    //   window.location.reload(false);
    // }, 2000);
  };

  useEffect(() => {
    const url = `http://localhost:5174/Tripko/ProsecnaOcenaVodica/${props.idVodica}`;
    jwtInterceptor
      .get(url)
      .then((response) => {
        setProsecnaOcenaVodica(response.data.toFixed(1));
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  }, [props.idVodica]);

  // useEffect(() => {
  //   const url = `http://localhost:5174/Tripko/ProfilnaSlika/PreuzmiProfilnuSliku`;
  //   jwtInterceptor
  //     .get(url)
  //     .then(response => {
  //       setProfilnaSlika(response.data);
  //       console.log(response.data);
  //     })
  //     .catch(error => {
  //       console.error(error.response.data);
  //     });
  // }, [props.profilnaSlika]);

  const datum = props.pocetak.split('T')[0];

  const handleDatumPocetkaChange = (event) => {
    setDatumPocetka(event.target.value);
  }
  const handleDatumKrajaChange = (event) => {
    setDatumKraja(event.target.value);
  }

  return (
    <div className="routeCard-container">
      {!isPublicRoute && (
        <div className="card-header-private">
          <button className="show-route-button" onClick={handleShowRoute}>
            Show Route
          </button>
          <button className="delete-route-button" onClick={handleDeleteRoute}>
            Delete Route
          </button>
        </div>
      )}
      <div className={`popup ${isPopupOpen ? 'open-popup' : ''}`}>
        <div>
          <p>Organizovanost</p>
          <ReactStars
            count={5}
            onChange={handleOrganizovanostRatingChange}
            size={20}
            activeColor="#ffd700"
          />
        </div>
        <div>
          <p>Bezbednost</p>
          <ReactStars
            count={5}
            onChange={handleBezbednostRatingChange}
            size={20}
            activeColor="#ffd700"
          />
        </div>
        <div>
          <p>Odnos cene i kvaliteta</p>
          <ReactStars
            count={5}
            onChange={handleOdnosCeneIKvalitetaRatingChange}
            size={20}
            activeColor="#ffd700"
          />
        </div>
        <div>
          <p>Osimisljeni program</p>
          <ReactStars
            count={5}
            onChange={handleOsimisljeniProgramRatingChange}
            size={20}
            activeColor="#ffd700"
          />
        </div>
        <button className="rate-button" onClick={handleSubmitRatings}>Submit</button>
      </div>
      <div
        className={`popup-publish ${isPublishPopupOpen ? 'open-popup-publish' : ''
          }`}
      >
        <form className="publish-form">
          <div>
            <p>Tour capacity</p>
            <input
              type="number"
              value={kapacitet}
              onChange={handleKapacitetChange}
            />
          </div>
          <div>
            <p>Earning percentage</p>
            <input
              type="number"
              value={procenatZarade}
              onChange={handleProcenatZaradeChange}
            />
          </div>
          <div>
            <p>Start date</p>
            <input
              type="date"
              value={datumPocetka}
              onChange={handleDatumPocetkaChange}
              className='date'
            />
          </div>
          <div>
            <p>End date</p>
            <input
              type="date"
              value={datumKraja}
              onChange={handleDatumKrajaChange}
              className='date'
            />
          </div>
          <div>
            <button type="submit" onClick={handlePublishRoute}>
              Publish
            </button>
          </div>
        </form>
      </div>
      <img src={slicka ? slicka : img} className="card-image img-fluid" />
      {!isTourist &&
        !isPublicRoute &&
        !isSubscribed /*ista vrdnost kao kad bi postojalo isPublished*/ && (
          <div className="card-footer-guide">
            <p className="publish-route-button" onClick={openPublishPopup}>
              Publish Route ᐃ
            </p>
          </div>
        )}
      {isPublicRoute && isTourist ? (
        <div>
          {isFinishedRoute && isSubscribed ? (
            <div className="card-header">
              <p onClick={openPopup}>RATE ROUTE ▽</p>
            </div>
          ) : (
            <div className="card-header-public">
              <button className="show-route-button" onClick={handleShowRoute}>
                Show Route
              </button>
              {isTourist &&
                (isSubscribed ? (
                  <button
                    className="unsubscribe-from-route-button"
                    onClick={handleUnsubscribeFromRoute}
                  >
                    Unsubscribe
                  </button>
                ) : (
                  <button
                    className="subscribe-to-route-button"
                    onClick={handleSubscribeToRoute}
                  >
                    Subscribe To Tour
                  </button>
                ))}
            </div>
          )}
          <div className="creator-image">
            <img src={profilnaSlika} />
          </div>
          <div className="card-footer">
            <span className="creator">
              {props.imeVodica} {props.prezimeVodica}
            </span>
            <ReactStars
              id="guide-stars"
              count={5}
              size={20}
              activeColor="#ffd700"
              color="#fff"
              onChange={handleRateGuide}
            />
          </div>
        </div>
      ) : (
        isPublicRoute && (
          <div>
            <div className="card-header-public">
              <button className="show-route-button" onClick={handleShowRoute}>
                Show Route
              </button>
              {isSubscribed && (
                <button
                  className="unpublish-route-button"
                  onClick={handleUnpublishRoute}
                >
                  Unpublish Route
                </button>
              )}
            </div>
            <div className="creator-image">
              <img src={profilnaSlika} />
            </div>
            <div className="card-footer">
              <span className="creator">
                {props.imeVodica} {props.prezimeVodica}
              </span>
              <ReactStars
                id="guide-stars"
                count={5}
                size={20}
                activeColor="#ffd700"
                color="#fff"
              />
            </div>
          </div>
        )
      )}
      <div className="route-caption" onClick={handleShowRoute}>
        <p className="routeName-city route-caption-heading">
          {props.nazivRute}
        </p>
        <p className="routeDate-routePrice route-caption-subheading text-muted">
          {datum}, {props.cena}din
        </p>
        {isPublicRoute && (
          <p className="freeSeats-routeRate-guideRate route-caption-subheading text-muted">
            Open spots: {props.brojSlobodnihMesta}, Route rate:{' '}
            {props.prosecnaOcenaRute}/5, Guide rate:{' '}
            {prosecnaOcenaVodica != -1 ? prosecnaOcenaVodica : '*'}/5
          </p>
        )}
      </div>
    </div>
  );
}
