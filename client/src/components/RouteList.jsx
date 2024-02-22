import React, { useEffect, useContext } from 'react';
import { RouteContext } from '../context/RouteContext';
import RouteFinder from '../apis/RouteFinder';

const RouteList = ({ from, to, date, travelerCount }) => {
    const { Routes, setRoutes, addRoute } = useContext(RouteContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await RouteFinder.post("/searchRoute", {
                    start_airport_name: from,
                    end_airport_name: to,
                    date: date.toISOString(), // Ensure date is in ISO format
                    traveler_count: travelerCount
                });
                setRoutes(response.data.data.Route);
            } catch (err) {
                console.error('Error fetching routes:', err);
            }
        };

        fetchData();
    }, [from, to, date, travelerCount]); // Add dependencies to useEffect

    return (
        <div className="list-group">
            {Routes.length > 0 && (
                <table id='routeList' className="table table-hover table-dark">
                    <thead>
                        <tr className="bg-primary">
                            <th scope="col">id</th>
                            <th scope="col">From (Airport id)</th>
                            <th scope="col">To (Airport id)</th>
                            <th scope="col">Departure Time</th>
                            <th scope="col">Arrival Time</th>
                            <th scope="col">Distance (Km)</th>
                            <th scope="col">Ticket</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Routes.map((route) => (
                            <tr key={route.id}>
                                <td>{route.id}</td>
                                <td>{route.start_airport_id}</td>
                                <td>{route.end_airport_id}</td>
                                <td>{route.departure_time}</td>
                                <td>{route.arrival_time}</td>
                                <td>{route.distance_km}</td>
                                <td>
                                    <button className="btn btn-warning">
                                        Buy
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RouteList;
