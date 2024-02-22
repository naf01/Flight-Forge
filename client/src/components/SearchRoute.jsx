import React, { useState, useContext, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RouteContext } from '../context/RouteContext';
import RouteFinder from '../apis/RouteFinder';

const SearchRoute = () => {
  const [startAirport, setStartAirport] = useState('');
  const [endAirport, setEndAirport] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [travelerCount, setTravelerCount] = useState(1);
  const [ticketClass, setTicketClass] = useState('commercial'); // Default ticket class
  const { setRoutes } = useContext(RouteContext);
  const [airports, setAirports] = useState([]);
  const [startSuggestedAirports, setStartSuggestedAirports] = useState([]);
  const [endSuggestedAirports, setEndSuggestedAirports] = useState([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const startSelectRef = useRef(null);
  const endSelectRef = useRef(null);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await RouteFinder.get('/airports');
        setAirports(response.data.data.Airport);
      } catch (error) {
        console.error('Error fetching airports:', error);
      }
    };

    fetchAirports();
  }, []);

  const handleInputChange = (inputValue, setAirport, setShowSuggestions, setSuggestedAirports) => {
    setAirport(inputValue);

    // Filter airports based on the city name input value
    const filteredAirports = airports.filter((airport) =>
      airport.address.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSuggestedAirports(filteredAirports);
    setShowSuggestions(true);
  };

  const handleAirportSelection = (e, setAirport, setShowSuggestions) => {
    const selectedAirport = e.target.value;
    setAirport(selectedAirport);
    setShowSuggestions(false); // Hide suggestions after selection
  };

  const handleStartAirportChange = (e) => {
    handleInputChange(e.target.value, setStartAirport, setShowStartSuggestions, setStartSuggestedAirports);
  };

  const handleEndAirportChange = (e) => {
    handleInputChange(e.target.value, setEndAirport, setShowEndSuggestions, setEndSuggestedAirports);
  };

  const handleStartAirportSelection = (e) => {
    handleAirportSelection(e, setStartAirport, setShowStartSuggestions);
  };

  const handleEndAirportSelection = (e) => {
    handleAirportSelection(e, setEndAirport, setShowEndSuggestions);
  };

  const handleClickOutside = (e) => {
    if (startSelectRef.current && !startSelectRef.current.contains(e.target)) {
      setShowStartSuggestions(false);
    }
    if (endSelectRef.current && !endSelectRef.current.contains(e.target)) {
      setShowEndSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await RouteFinder.post('/searchRoute', {
        start_airport_name: startAirport,
        end_airport_name: endAirport,
        date: selectedDate.toISOString(),
        traveler_count: travelerCount,
        ticket_class: ticketClass, // Include ticket class in the request
      });
      setRoutes(response.data.data.Route);
    } catch (err) {
      console.error('Error searching for routes:', err);
    }
  };

  return (
    <div className="mb-4" style={{ 
      backgroundColor: 'white', 
      padding: '20px', 
      borderRadius: '10px', 
      boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
      margin: '20px auto',
      width: '75%'
    }}>
      <form>
        <div className="form-row mb-3">
          <div className="col" ref={startSelectRef}>
            <input
              type="text"
              value={startAirport}
              onChange={handleStartAirportChange}
              className="form-control"
              placeholder="From"
              style={{ fontSize: '1.2rem' }} // Adjust height here
            />
            {showStartSuggestions && startSuggestedAirports.length > 0 && (
              <select
                className="form-control"
                style={{ 
                  fontSize: '1rem', 
                  marginTop: '5px', 
                  position: 'absolute', 
                  zIndex: '1', 
                  fontFamily: 'Calibri Light',
                  display: 'block', // Ensure the dropdown is block-level
                }}
                size={5} // Set the visible number of options
                onChange={(e) => {
                  handleStartAirportSelection(e);
                  setStartSuggestedAirports([]); // Clear suggestions after selection
                }}
                onBlur={() => setShowStartSuggestions(false)} // Close the dropdown on blur
              >
                {startSuggestedAirports.map((airport) => {
                  // Split the address string by comma and get the first part (city)
                  const city = airport.address.split(',')[0].trim();

                  return (
                    <option 
                      key={airport.id} 
                      value={airport.name}
                      style={{
                        padding: '5px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #ccc',
                        borderTop: '1px solid #ccc',
                        backgroundColor: 'white', // Set default background color
                      }}
                    >
                      <span 
                        style={{
                          display: 'block',
                          padding: '5px',
                          cursor: 'pointer',
                          backgroundColor: '#f2f2f2', // Change background color on hover
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#e0e0e0'} // Change background color on hover
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#f2f2f2'} // Reset background color on hover out
                      >
                        {airport.name}, {city}
                      </span>
                    </option>
                  );
                })}
              </select>
            )}
          </div>
          <div className="col" ref={endSelectRef}>
            <input
              type="text"
              value={endAirport}
              onChange={handleEndAirportChange}
              className="form-control"
              placeholder="To (city name)"
              style={{ fontSize: '1.2rem' }} // Adjust height here
            />
            {showEndSuggestions && endSuggestedAirports.length > 0 && (
              <select
                className="form-control"
                style={{ 
                  fontSize: '1rem', 
                  marginTop: '5px', 
                  position: 'absolute', 
                  zIndex: '1', 
                  fontFamily: 'Calibri Light',
                  display: 'block', // Ensure the dropdown is block-level
                }}
                size={5} // Set the visible number of options
                onChange={(e) => {
                  handleEndAirportSelection(e);
                  setEndSuggestedAirports([]); // Clear suggestions after selection
                }}
                onBlur={() => setShowEndSuggestions(false)} // Close the dropdown on blur
              >
                {endSuggestedAirports.map((airport) => {
                  // Split the address string by comma and get the first part (city)
                  const city = airport.address.split(',')[0].trim();

                  return (
                    <option 
                      key={airport.id} 
                      value={airport.name}
                      style={{
                        padding: '5px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #ccc',
                        borderTop: '1px solid #ccc',
                        backgroundColor: 'white', // Set default background color
                      }}
                    >
                      <span 
                        style={{
                          display: 'block',
                          padding: '5px',
                          cursor: 'pointer',
                          backgroundColor: '#f2f2f2', // Change background color on hover
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#e0e0e0'} // Change background color on hover
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#f2f2f2'} // Reset background color on hover out
                      >
                        {airport.name}, {city}
                      </span>
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        </div>
        <div className="form-row mb-3" style={{ display: 'flex', alignItems: 'center' }}>
  <div className="col" style={{ flex: '1' }}>
    <select
      value={ticketClass}
      onChange={(e) => setTicketClass(e.target.value)}
      className="form-control"
      style={{ fontSize: '1rem' }} // Adjust font size if needed
    >
      <option value="commercial">Commercial</option>
      <option value="business">Business</option>
    </select>
  </div>
</div>

        <div className="form-row mb-3">
          <div className="col">
            <div className="input-group">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="Select Date"
                style={{ fontSize: '1.2rem' }}
              />
              <div className="input-group-append">
                <span className="input-group-text">
                  <i className="fa fa-calendar"></i>
                </span>
              </div>
            </div>
          </div>
          <div className="col">
            <input
              type="number"
              value={travelerCount}
              onChange={(e) => setTravelerCount(e.target.value)}
              className="form-control"
              placeholder="Traveler Count"
              style={{ fontSize: '1.2rem' }}
            />
          </div>
        </div>
        <div className="form-row d-flex justify-content-center">
          <button onClick={handleSearch} className="btn btn-primary" style={{ backgroundColor: '#800000', borderColor: '#800000', fontSize: '1.2rem' }}>
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchRoute;
