import React, { useEffect, useState } from 'react';
import './Main_PublicRoutesGrid-style.css';
import RouteCard from '../routeCardComponent/routeCard';
import jwtInterceptor from '../authentication/jwtInterceptor';
import { useNavigate } from 'react-router-dom';

export default function PublicRoutesGrid() {
  const navigate = useNavigate();

  const handleSeeMoreClicked = () => {
    navigate(`/main-page/pretraga-rute/javna`);
  };

  const [fetchedData, setFetchedData] = useState(null);
  useEffect(() => {
    jwtInterceptor
      .get('http://localhost:5174/Ruta/PreuzmiSveJavneRute')
      .then((response) => {
        setFetchedData(response.data);
      });
  }, []);
  console.log(fetchedData);

  const publicRoutes =
    fetchedData &&
    fetchedData.map((route, index) => {
      if (index < 3)
        return (
          <div className="route-item">
            <RouteCard
              key={route.id}
              {...route}
              isPublicRoute={true}
              isSubscribed={false} // pogledaj
            />
          </div>
        );
    });

  return (
    <div className="publicRoutes-container">
      <section className="page-section bg-light" id="publicroutes">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase h2">Public Routes</h2>
            <h3 className="section-subheading text-muted h3">
              Join one of amazing tours
            </h3>
          </div>
          <div className="row">
            {/*<div className="col-lg-4 col-sm-6 mb-4 .size-1200px">
               Portfolio item 1
              <div className="route-item"></div> */}
            {/* <RouteCard key={allRoutes[0].id}
                {...allRoutes[0]} />
            </div>
            <div className="col-lg-4 col-sm-6 mb-4 mb-lg-0 .size-1200px">
              <RouteCard key={allRoutes[1].id}
                {...allRoutes[1]} />
            </div>
            <div className="col-lg-4 col-sm-6 mb-4 .size-1200px">
              <RouteCard key={allRoutes[2].id}
                {...allRoutes[2]} />
            </div> */}
            {publicRoutes}
            <div className="see-more-div">
              <button onClick={() => handleSeeMoreClicked()}>See More ≫</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
