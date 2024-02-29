import React, { useContext, useState, useEffect } from 'react';
import { RouteContext } from '../context/RouteContext';
import { useNavigate } from 'react-router-dom';
import RouteFinder from '../apis/RouteFinder';

const BookTicket = () => {
    const { selectedTransit } = useContext(RouteContext);
    const [seatsToBook, setSeatsToBook] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [error, setError] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await RouteFinder.post('/user/authenticate', {
                    token: localStorage.getItem('token')
                });
                if (response.status === 200) {
                } else {
                    navigate('/signin');
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

        const id = prompt('Enter Transaction ID');
        if (id !== null) {
            setTransactionId(id);
            navigate('/');
        }
    };

    const handleGoToHome = () => {
        navigate('/');
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/login');
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
                            <label className='font-weight-bold'>Total Cost:</label>
                            <input type="text" className="form-control" value={`$${seatsToBook * selectedTransit.cost}`} readOnly style={{ backgroundColor: '#F0F0F0' }} />
                        </div>
                        <div className="mb-3">
                            <label className='font-weight-bold' htmlFor="seats">Seats to Book:</label>
                            <input type="number" id="seats" className="form-control" value={seatsToBook} onChange={(e) => {
                                if (e.target.value < 1) {
                                    setSeatsToBook(1);
                                } else if (e.target.value > 30) {
                                    setSeatsToBook(30);
                                } else {
                                    setSeatsToBook(e.target.value);
                                }
                            }} />
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
