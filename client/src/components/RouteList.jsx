import React, { useContext, useState, useEffect } from 'react';
import { RouteContext } from '../context/RouteContext';
import RouteFinder from '../apis/RouteFinder';
import { Link } from 'react-router-dom';

const RouteList = () => {
    const { transitInfo, setSelectedTransit } = useContext(RouteContext);
    const [departureTimes, setDepartureTimes] = useState([]);
    const [arrivalTimes, setArrivalTimes] = useState([]);
    const [expandedTransit, setExpandedTransit] = useState(null);

    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const departurePromises = transitInfo.map(async (transit) => {
                    const response = await RouteFinder.post('/route/departuretime', { route_id: transit.route[0] });
                    return response.data.time;
                });

                const arrivalPromises = transitInfo.map(async (transit) => {
                    const response = await RouteFinder.post('/route/arrivaltime', { route_id: transit.route[transit.route.length - 1] });
                    return response.data.time;
                });

                const departureTimes = await Promise.all(departurePromises);
                const arrivalTimes = await Promise.all(arrivalPromises);

                setDepartureTimes(departureTimes);
                setArrivalTimes(arrivalTimes);
            } catch (error) {
                console.error('Error fetching times:', error);
            }
        };

        fetchTimes();
    }, [transitInfo]);

    const toggleExpand = (index) => {
        setExpandedTransit(expandedTransit === index ? null : index);
    };

    const handleBuyTicket = (transit) => {
        console.log('Selected transit:', transit);
        setSelectedTransit(transit);
    };

    const renderExpandedDetails = (transit) => {
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>Airplane Name</th>
                        <th>Airport From</th>
                        <th>Airport To</th>
                    </tr>
                </thead>
                <tbody>
                    {transit.airplanename.map((airplane, i) => (
                        <tr key={i}>
                            <td>{airplane}</td>
                            <td>{transit.airport[i]}</td>
                            <td>{transit.airport[i + 1]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div>
            {transitInfo.length > 0 ? (
                <div className="container">
                    {transitInfo.map((transit, index) => (
                        <div key={index} className="card my-3">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <p className="text-left font-weight-bold">{transit.airport[0]}</p>
                                        <p className="text-left font-weight-bold">{departureTimes[index]}</p>
                                        <p className="text-left font-weight-bold">{transit.date[0]}</p>
                                    </div>
                                    <div className="col text-right">
                                        <p className="text-right font-weight-bold">{transit.airport[transit.airport.length - 1]}</p>
                                        <p className="text-right font-weight-bold">{arrivalTimes[index]}</p>
                                        <p className="text-right font-weight-bold">{transit.date[transit.airport.length - 1]}</p>
                                    </div>
                                </div>
                                <hr style={{ borderColor: 'red', borderWidth: '2px' }} />
                                <div className="red-dots-container">
                                    {/* Render red dots here */}
                                </div>
                                <p className="text-center font-weight-bold">{transit.route.length}</p>
                                <p className="text-left font-weight-bold">Seat Left : {transit.seatsLeft}</p>
                                <Link
                                    to="/bookticket"
                                    className={transit.seatsLeft === 0 ? 'btn btn-secondary float-right' : 'btn btn-danger float-right'}
                                    disabled={transit.seatsLeft === 0}
                                    onClick={() => handleBuyTicket(transit)}
                                >
                                    Book Now
                                </Link>
                                <p className="text-left mt-3">
                                    <span className="font-weight-bold" style={{ fontSize: '1.5rem' }}>Total Cost: ${transit.cost}</span>
                                </p>
                                <a href='#'
                                    onClick={() => toggleExpand(index)}
                                    style={{ color: 'red', fontStyle: 'italic', textDecoration: 'underline' }}
                                >
                                    Expand
                                </a>
                                <div style={{ paddingBottom: '30px' }}></div>
                                {expandedTransit === index && (
                                    <div>
                                        {renderExpandedDetails(transit)}
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default RouteList;
