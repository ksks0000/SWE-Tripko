import React from 'react';
import { useNavigate } from 'react-router-dom';
import RouteCard from '../routeCardComponent/routeCard';
import { all } from 'axios';

function MainPretragaRute({ routes, renderPretragaRuteMap, tipRuta }) {
  function handleRouteClick(routeId) {
    console.log(routeId, 'MainPretragaRute');
    renderPretragaRuteMap(routeId);
  }
  const navigate = useNavigate();

  // javne
  const allPublicRoutes =
    routes &&
    routes.map((route) => {
      return (
        <div className="route-item">
          <RouteCard
            key={route.id}
            {...route}
            isPublicRoute={true}
            isSubscribed={false}
          />
        </div>
      );
    });

  // privatne
  const allPrivateRoutes =
    routes &&
    routes.map((route) => {
      return (
        <div className="route-item">
          <RouteCard
            key={route.id}
            {...route}
            isPublicRoute={false}
            isSubscribed={false}
          />
        </div>
      );
    });

  // objavljene
  const allPublishedRoutes =
    routes &&
    routes.map((route) => {
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

  // pretplacene (i zavrsene)
  const allSubscribedRoutes =
    routes &&
    routes.map((route) => {
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

  const handleCreateRoute = () => {
    navigate('/main-page/pre-dodavanja-rute');
  }

  return (
    <div className="pretraga-route-container">
      {tipRuta === 'javna' && allPublicRoutes}
      {tipRuta === 'privatna' && allPrivateRoutes}
      {tipRuta === 'zavrsena' && allSubscribedRoutes}
      {tipRuta === 'objavljena' && allPublishedRoutes}
      {tipRuta === 'privatna' && <div className='create-route' onClick={handleCreateRoute}>
        <p>+</p>
      </div>}
    </div>
  );
}

export default MainPretragaRute;
