import React, { useEffect, useState } from 'react';
import './Main_PublishedRoutesGrid-style.css';
import RouteCard from '../routeCardComponent/routeCard';
import { useNavigate } from 'react-router-dom';
import jwtInterceptor from '../authentication/jwtInterceptor';

export default function PublishedRoutesGrid() {
    const navigate = useNavigate();

    const handleSeeMoreClicked = () => {
        navigate(`/main-page/pretraga-rute/objavljena`);
    };

    const [fetchedData, setFetchedData] = useState(null);
    useEffect(() => {
        jwtInterceptor
            .get('http://localhost:5174/Ruta/PreuzmiJavneRuteKorisnika')
            .then((response) => {
                setFetchedData(response.data);
            });
    }, []);
    console.log(fetchedData);

    const publishedRoutes =
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
        <div className="publishedRoutes-container">
            <section className="page-section bg-light" id="publishedroutes">
                <div className="container">
                    <div className="text-center">
                        <h2 className="section-heading text-uppercase h2">
                            Published Routes
                        </h2>
                        <h3 className="section-subheading text-muted h3">
                            Get ready for the best moments
                        </h3>
                    </div>
                    <div className="row">
                        {publishedRoutes}
                        <div className="see-more-div">
                            <button onClick={handleSeeMoreClicked}>See More ≫</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}