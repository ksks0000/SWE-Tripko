import React, { useEffect, useState } from 'react';
import './Main_FinishedRoutesGrid-style.css';
import RouteCard from '../routeCardComponent/routeCard';
import { useNavigate } from 'react-router-dom';
import jwtInterceptor from '../authentication/jwtInterceptor';

export default function FinishedRoutesGrid() {
  const navigate = useNavigate();

  const handleSeeMoreClicked = () => {
    navigate(`/main-page/pretraga-rute/zavrsena`);
  };

  const [fetchedData, setFetchedData] = useState(null);
  useEffect(() => {
    jwtInterceptor
      .get('http://localhost:5174/Ruta/PreuzmiRezervisaneRuteKorisnika')
      .then((response) => {
        setFetchedData(response.data[0]);
      });
  }, []);
  console.log(fetchedData);

  const subscribedRoutes =
    fetchedData &&
    fetchedData.map((route, index) => {
      if (index < 3)
        return (
          <div className="route-item">
            <RouteCard
              key={route.id}
              {...route}
              isPublicRoute={true}
              isSubscribed={true}
            />
          </div>
        );
    });

  return (
    <div className="finishedRoutes-container">
      <section className="page-section bg-light" id="finishedroutes">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase h2">
              Subscribed Routes
            </h2>
            <h3 className="section-subheading text-muted h3">
              Get ready for the best moments or remind them and rate the route
            </h3>
          </div>
          <div className="row">
            {subscribedRoutes}
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
