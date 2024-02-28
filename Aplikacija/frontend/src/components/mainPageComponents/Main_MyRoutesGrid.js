import React from 'react';
import './Main_MyRoutesGrid-style.css';
import RouteCard from '../routeCardComponent/routeCard';
import { Link, useNavigate } from 'react-router-dom';
import jwtInterceptor from '../authentication/jwtInterceptor';
import { useState, useEffect } from 'react';

export default function MyRoutesGrid() {
  const [fetchedData, setFetchedData] = useState(null);
  useEffect(() => {
    jwtInterceptor
      .get('http://localhost:5174/Ruta/PreuzmiPrivatneRuteKorisnika')
      .then((response) => {
        setFetchedData(response.data);
      });
  }, []);

  const navigate = useNavigate();
  const handleSeeMoreClicked = () => {
    navigate(`/main-page/pretraga-rute/privatna`);
  };

  const privateRoutes =
    fetchedData &&
    fetchedData.map((route, index) => {
      if (index < 3)
        return (
          <div className="route-item">
            <RouteCard
              key={route.id}
              {...route}
              isPublicRoute={false}
              isSubscribed={false} // pogledaj
            />
          </div>
        );
    });

  return (
    <div className="myRoutes-container">
      <div className="h2-overlay"></div>
      <section className="page-section bg-light" id="myroutes">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase h2">My Routes</h2>
            <h3
              id="My-routes-subheading"
              className="section-subheading text-muted h3"
            >
              Start planning your next adventure
            </h3>
            <Link
              className="btn btn-primary btn-xl text-uppercase"
              id="Create-route-button"
              to={'pre-dodavanja-rute'}
            >
              Create new route
            </Link>
          </div>
          <div className="row">
            {privateRoutes}
            {/* <div className="col-lg-4 col-sm-6 mb-4 size-1200px">
              <RouteCard />
            </div>
            <div className="col-lg-4 col-sm-6 mb-4 mb-lg-0 size-1200px">
              <RouteCard />
            </div>
            <div className="col-lg-4 col-sm-6 mb-4 size-1200px">
              <RouteCard />
            </div> */}
            <div className="see-more-div">
              <button onClick={handleSeeMoreClicked}>See More ≫</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
