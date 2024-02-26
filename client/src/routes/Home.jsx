// Home.jsx
import React, { useState } from 'react';
import Header from '../components/Header';
import SearchRoute from '../components/SearchRoute';
import RouteList from '../components/RouteList';
import backgroundImage from 'D:/CP/Projects/Flight-Forge/client/src/assets/cover.png'; // Import your background image
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        window.location.reload();
    };

    return (
        <div style={{
            backgroundImage: `url(${backgroundImage})`, // Use the imported background image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh', // Ensures the background covers the entire viewport height
            paddingTop: '10px', // Adjust the top padding as needed
            // You can add more styles as needed
        }}>
            <Header isLoggedIn={isLoggedIn} handleSignOut={handleSignOut} />
            <SearchRoute/>
            <RouteList/>
        </div>
    )
}

export default Home;
