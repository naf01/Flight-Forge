// Home.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import SearchRoute from '../components/SearchRoute';
import RouteList from '../components/RouteList';
import backgroundImage from 'D:/CP/Projects/Flight-Forge/client/src/assets/cover.png'; // Import your background image

const Home = () => {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(location.state && location.state.isLoggedIn);

    const handleSignOut = () => {
        // Clear user ID and password from cookies
        document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setIsLoggedIn(false);
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
