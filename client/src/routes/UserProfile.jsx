import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import RouteFinder from '../apis/RouteFinder';
import defaultprofileimage from 'D:/CP/Projects/Flight-Forge/client/src/assets/atika.jpeg';
import backgroundImage from 'D:/CP/Projects/Flight-Forge/client/src/assets/cover.png';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate(); // Use useNavigate hook

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await RouteFinder.post('/user/authenticate', {
                    token: localStorage.getItem('token')
                });
                console.log(response.status);
                if (response.status === 200) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                    navigate('/'); // Redirect to "/" if not logged in
                }
            } catch (error) {
                setIsLoggedIn(false);
                navigate('/'); // Redirect to "/" if not logged in
            }
        };

        fetchUserData();
        fetchProfileData();
    }, [navigate]);

    const fetchProfileData = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('User ID or password not found.');
                return;
            }

            const response = await RouteFinder.post('/user/profiledata', {
                id: 0,
                token: token
            });
            console.log(response);
            setUserData(response.data.data.user);
        } catch (error) {
            console.error('Error fetching user data:');
            setError('Failed to fetch user data. Please try again.');
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        window.location.reload(); // Reload the current page
        console.log("Signing out...");
    };

    return (
        <div className="container-fluid" style={{
            backgroundImage: `url(${backgroundImage})`, // Use the imported background image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh', // Ensures the background covers the entire viewport height
            paddingTop: '10px', // Adjust the top padding as needed
            // You can add more styles as needed
        }}>
            <div className="container mt-4">
                <div className="d-flex justify-content-end align-items-center mb-4">
                    <div className="mr-auto">
                        <img src={defaultprofileimage} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%', marginRight: '10px' }} />
                        <h1 style={{ paddingTop: '30px', color: 'green', fontWeight: 'bold', fontFamily: 'cursive' }}>{userData ? userData.id : ''}</h1>
                    </div>
                    <div className="button-group">
                        <Link style={{
              color: 'white', 
              backgroundColor: '#800000', 
              padding: '15px 20px', // Adjust padding here
              marginRight: '10px', 
              borderRadius: '5px',
              cursor: 'pointer',
              textDecoration: 'none', 
              fontSize: '16px', 
              transition: 'background-color 0.3s',
            }} to="/">Go to Home</Link>
                        <button style={{
              color: 'white', 
              backgroundColor: '#800000', 
              padding: '15px 20px', // Adjust padding here
              marginRight: '10px', 
              borderRadius: '5px',
              cursor: 'pointer',
              textDecoration: 'none', 
              fontSize: '16px', 
              transition: 'background-color 0.3s',
            }} onClick={handleSignOut}>Sign Out</button>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-9">
                        {userData ? (
                            <div>
                                <div className="user-info-group shadow p-3 mb-5 bg-white rounded">
                                    <h4 style={{ marginBottom: '20px', fontSize: '24px', textAlign: 'center', fontFamily: 'cursive' }}>User Info</h4>
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>First Name</th>
                                                <td>{userData.first_name}</td>
                                            </tr>
                                            <tr>
                                                <th>Last Name</th>
                                                <td>{userData.last_name}</td>
                                            </tr>
                                            <tr>
                                                <th>Date of Birth</th>
                                                <td>{userData.dateofbirth}</td>
                                            </tr>
                                            <tr>
                                                <th>Age</th>
                                                <td>{userData.age}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="contact-group shadow p-3 mb-5 bg-white rounded">
                                    <h4 style={{ marginBottom: '20px', fontSize: '24px', textAlign: 'center', fontFamily: 'cursive' }}>Contact</h4>
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>Mobile Number</th>
                                                <td>{userData.mobileno.join(', ')}</td>
                                            </tr>
                                            <tr>
                                                <th>Gmail Account</th>
                                                <td>{userData.email}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="address-group shadow p-3 mb-5 bg-white rounded">
                                    <h4 style={{ marginBottom: '20px', fontSize: '24px', textAlign: 'center', fontFamily: 'cursive' }}>Address</h4>
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>City</th>
                                                <td>{userData.city}</td>
                                            </tr>
                                            <tr>
                                                <th>Country</th>
                                                <td>{userData.country}</td>
                                            </tr>
                                            <tr>
                                                <th>Zipcode</th>
                                                <td>{userData.zipcode}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p>{error || 'Loading...'}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
