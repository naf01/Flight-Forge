import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import RouteFinder from '../apis/RouteFinder';
import defaultprofileimage from 'D:/CP/Projects/Flight-Forge/client/src/assets/tlogo.png';
import backgroundImage from 'D:/CP/Projects/Flight-Forge/client/src/assets/cover.png';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userId = 34;
            const password = 'atikahoneybeeeofsakib';
    
            if (!userId || !password) {
                setError('User ID or password not found.');
                return;
            }
    
            const response = await RouteFinder.post('/user/profiledata', {
                id: userId,
                password: password
            });
            console.log(response);
            setUserData(response.data.data.user);
        } catch (error) {
            console.error('Error fetching user data:');
            setError('Failed to fetch user data. Please try again.');
        }
    };    

    const handleSignOut = () => {
        // Perform signout action here
        // Redirect to home or perform any other action
        console.log("Signing out...");
    };

    return (
        <div className="container-fluid"  style={{
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
                        <img src={defaultprofileimage} alt="Profile" style={{ width: '100px', borderRadius: '50%', marginRight: '10px' }} />
                    </div>
                    <div className="button-group">
                        <Link to="/" className="btn btn-danger mr-2">Go to Home</Link>
                        <button className="btn btn-danger" onClick={handleSignOut}>Sign Out</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-9">
                        {userData ? (
                            <div>
                                <div className="user-info-group shadow p-3 mb-5 bg-white rounded">
                                    <h4>User Info</h4>
                                    <p>First Name: {userData.first_name}</p>
                                    <p>Last Name: {userData.last_name}</p>
                                    <p>Date of Birth: {userData.dateofbirth}</p>
                                    <p>Age: {userData.age}</p>
                                </div>
                                <div className="contact-group shadow p-3 mb-5 bg-white rounded">
                                    <h4>Contact</h4>
                                    <p>Mobile Number: {userData.mobileno.join(', ')}</p>
                                    <p>Gmail Account: {userData.email}</p>
                                </div>
                                <div className="address-group shadow p-3 mb-5 bg-white rounded">
                                    <h4>Address</h4>
                                    <p>City: {userData.city}</p>
                                    <p>Country: {userData.country}</p>
                                    <p>Zipcode: {userData.zipcode}</p>
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
