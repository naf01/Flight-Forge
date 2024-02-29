import React, { useContext, useState, useEffect } from 'react';
import { RouteContext } from '../context/RouteContext';
import { Link, Navigate, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import axios from 'axios';
import RouteFinder from '../apis/RouteFinder';

const BookTicket = () => {
    const { selectedTransit } = useContext(RouteContext);
    const [seatsToBook, setSeatsToBook] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [error, setError] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate(); // Use useNavigate hook

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log('Checking authentication...');
                const response = await RouteFinder.post('/user/authenticate', {
                    token: localStorage.getItem('token')
                });
                console.log(response.status);
                if (response.status === 200) {
                } else {
                    navigate('/signin'); // Redirect to "/" if not logged in
                }
            } catch (error) {
                setAuthenticated(false);
            }
        };

        fetchUserData();
    }, []);

    const handleBookTicket = () => {
        if (seatsToBook > selectedTransit.seatsLeft) {
            setError(`Cannot book ${seatsToBook} seats. Only ${selectedTransit.seatsLeft} seats left.`);
            return;
        }

        // Add your booking logic here
        console.log('Booking', seatsToBook, 'seats using', paymentMethod);
        // Redirect to another page
        window.location.href = '/booked';
    };

    const handleGoToHome = () => {
        window.location.href = '/';
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="container mt-5">
            {authenticated && (
                <div className="d-flex justify-content-end mb-3">
                    <button className="btn btn-primary me-2" onClick={handleGoToHome}>Go to Home</button>
                    <button className="btn btn-danger" onClick={handleSignOut}>Sign Out</button>
                </div>
            )}
            <h1 style={{ textAlign: 'center' }}>Book Ticket</h1>
            {selectedTransit && (
                <div className="mt-4">
                    <h5>Transit Details</h5>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <td className='font-weight-bold'>Airplane Name:</td>
                                <td>{selectedTransit.airplanename.join(' --> ')}</td>
                            </tr>
                            <tr>
                                <td className='font-weight-bold'>Airports:</td>
                                <td>{selectedTransit.airport.join(' --> ')}</td>
                            </tr>
                            <tr>
                                <td className='font-weight-bold'>Cost:</td>
                                <td>${selectedTransit.cost}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="mt-4">
                        <h5>Book Seats</h5>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="mb-3">
                            <label className='font-weight-bold' htmlFor="seats">Seats to Book:</label>
                            <input type="number" id="seats" className="form-control" value={seatsToBook} onChange={(e) => setSeatsToBook(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className='font-weight-bold' htmlFor="paymentMethod">Payment Method:</label>
                            <select id="paymentMethod" className="form-control" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="">Select Payment Method</option>
                                <option value="bkash">Bkash</option>
                                <option value="DBBBL">DBBBL</option>
                                <option value="DebitCard">Debit Card</option>
                            </select>
                        </div>
                        <button className="btn" style={{ backgroundColor: 'red' }} onClick={handleBookTicket}>Book</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookTicket;
