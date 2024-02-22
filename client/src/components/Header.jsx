// Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from 'D:/CP/Projects/Airplane_ticketing/client/src/assets/tlogo.png'; // Import your logo image file

const Header = ({ isLoggedIn, handleSignOut }) => {
  return (
    <div style={{ 
      backgroundColor: 'none', 
      padding: '10px', 
      borderBottom: 'none', // Remove the border
      marginTop: 'none', // Add top margin
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: 'none', // Remove shadow effect
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logoImage} alt="Logo" style={{ width: '150px', marginRight: '10px' }} /> {/* Adjust width here */}
      </div>
      <h1 style={{ color: 'black', fontWeight: 'bold', fontSize: '64px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', margin: '0', textAlign: 'center' }}>FlightForge</h1>
      <div style={{ display: 'flex' }}>
        {isLoggedIn ? (
          <>
            <Link 
              to="/userprofile" 
              style={{
                color: 'white', 
                backgroundColor: '#800000', 
                padding: '15px 20px', // Adjust padding here
                marginRight: '10px', 
                borderRadius: '5px', 
                cursor: 'pointer',
                textDecoration: 'none', 
                fontSize: '16px', 
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#600000'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#800000'}
            >
              Profile
            </Link>
            <span 
              onClick={handleSignOut} 
              style={{
                color: 'white', 
                backgroundColor: '#800000', 
                padding: '15px 20px', // Adjust padding here
                marginRight: '10px', 
                borderRadius: '5px', 
                cursor: 'pointer',
                textDecoration: 'none', 
                fontSize: '16px', 
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#600000'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#800000'}
            >
              Sign Out
            </span>
          </>
        ) : (
          <Link 
            to="/signin" 
            style={{
              color: 'white', 
              backgroundColor: '#800000', 
              padding: '15px 20px', // Adjust padding here
              marginRight: '10px', 
              borderRadius: '5px',
              cursor: 'pointer',
              textDecoration: 'none', 
              fontSize: '16px', 
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#600000'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#800000'}
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
