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
    const [userData, setUserData] = useState(null);
    const [travelersInfo, setTravelersInfo] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Simulate authentication success
                const response = await RouteFinder.post('/user/authenticate', {
                    token: localStorage.getItem('token')
                });
                if (response.status === 200) {
                    setAuthenticated(true);

                    const token = localStorage.getItem('token');

                    if (!token) {
                        setError('User ID or password not found.');
                        return;
                    }

                    const response = await RouteFinder.post('/user/profiledata', {
                        id: 0,
                        token: token
                    });

                    let user = response.data.data.user;
                    let dateParts = user.dateofbirth.split('-');
                    let formattedDate = dateParts[0] + '-' + dateParts[1] + '-' + dateParts[2].split('T')[0];;
                    console.log(user.address);
                    setUserData({
                        name: user.first_name + ' ' + user.last_name,
                        dob: formattedDate,
                        email: user.email,
                        country: user.addres,
                        city: user.city,
                        passportnumber: user.passportnumber
                    });
                } else {
                    setAuthenticated(false);
                    navigate('/signin');
                }
            } catch (error) {
                setAuthenticated(false);
            }
        };

        fetchUserData();
    }, []);

    const handleBookTicket = () => {
        // Handle booking logic here
    };

    const handleGoToHome = () => {
        navigate('/');
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...travelersInfo];
        list[index][name] = value;
        setTravelersInfo(list);
        // Update userData if the traveler info is updated
        if (index === 0) {
            setUserData(prevUserData => ({
                ...prevUserData,
                [name]: value
            }));
        }
    };

    useEffect(() => {
        const newList = [];
        for (let i = 0; i < seatsToBook; i++) {
            if (i === 0) {
                newList.push(userData);
            } else {
                newList.push({
                    name: '',
                    dob: '',
                    email: ''
                    // Add more fields as needed
                });
            }
        }
        setTravelersInfo(newList);
    }, [seatsToBook, userData]);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-danger" onClick={handleGoToHome} style={{
                    color: 'white',
                    padding: '15px 20px', // Adjust padding here
                    marginRight: '10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    fontSize: '16px',
                    transition: 'background-color 0.3s',
                }} to="/">Go to Home</button>
                <button className="btn btn-danger" onClick={handleSignOut} style={{
                    color: 'white',
                    padding: '15px 20px', // Adjust padding here
                    marginRight: '10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    fontSize: '16px',
                    transition: 'background-color 0.3s',
                }} to="/signin">Sign Out</button>
            </div>

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
                        {/* Input fields for traveler information */}
                        {travelersInfo.map((traveler, index) => (
                            <div key={index} className="card mb-3" style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}>
                                <div className="card-body">
                                    <h5 className="card-title">Traveler {index + 1}</h5>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" className="form-control" name="name" value={traveler?.name || ''} readOnly={index === 0 ? true : false} onChange={(e) => handleInputChange(index, e)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Date of Birth</label>
                                        <input type="date" className="form-control" name="dob" value={traveler?.dob || ''} readOnly={index === 0 ? true : false} onChange={(e) => handleInputChange(index, e)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" name="email" value={traveler?.email || ''} readOnly={index === 0 ? true : false} onChange={(e) => handleInputChange(index, e)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Country</label>
                                        <input type="country" className="form-control" name="email" value={traveler?.email || ''} readOnly={index === 0 ? true : false} onChange={(e) => handleInputChange(index, e)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">City</label>
                                        <input type="city" className="form-control" name="email" value={traveler?.email || ''} readOnly={index === 0 ? true : false} onChange={(e) => handleInputChange(index, e)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Passport Number</label>
                                        <input type="passportnumber" className="form-control" name="email" value={traveler?.email || ''} readOnly={index === 0 ? true : false} onChange={(e) => handleInputChange(index, e)} />
                                    </div>
                                    {/* Add more fields as needed */}
                                </div>
                            </div>
                        ))}
                        <button className="btn" style={{ backgroundColor: 'red' }} onClick={handleBookTicket}>Book</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BookTicket;
