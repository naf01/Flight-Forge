import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const password = localStorage.getItem('password');

            if (!userId || !password) {
                setError('User ID or password not found.');
                return;
            }

            const response = await axios.post('/api/v1/user/profiledata', { user_id: userId, password: password });
            if (response.status === 200 && response.data.status === "success") {
                setUserData(response.data.data.flightforge[0]); // Assuming user data is returned as an array with a single object
            } else {
                setError(response.data.data.flightforge);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to fetch user data. Please try again.');
        }
    };

    return (
        <div>
            {userData ? (
                <div>
                    <h2>User Profile</h2>
                    <p>User ID: {userData.id}</p>
                    <p>First Name: {userData.first_name}</p>
                    <p>Last Name: {userData.last_name}</p>
                    {/* Add more user data fields as needed */}
                </div>
            ) : (
                <p>{error}</p>
            )}
        </div>
    );
};

export default UserProfile;
