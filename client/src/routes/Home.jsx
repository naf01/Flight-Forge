// Home.jsx
import React, { useState } from 'react';
import Header from '../components/Header';
import SearchRoute from '../components/SearchRoute';
import RouteList from '../components/RouteList';
import backgroundImage from 'D:/CP/Projects/Flight-Forge/client/src/assets/cover.png'; // Import your background image

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Set initial state to true for logged-in

    const handleSignOut = () => {
        // Perform signout action here
        setIsLoggedIn(false);
        // Redirect to home or perform any other action
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
