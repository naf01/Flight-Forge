import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import { RouteContextProvider } from './context/RouteContext';
import ReviewPage from './routes/ReviewPage';
import SignInPage from './routes/SignInPage';
import CreateAccount from './routes/CreateAccount';
import { Helmet } from 'react-helmet';
import UserProfile from './routes/UserProfile';
import BookTicket from './routes/BookTicket';
import icon from 'D:/CP/Projects/Flight-Forge/client/src/assets/tlogo.png'; // Import your favicon image

const App = () => {
    return (
        <RouteContextProvider>
            <div>
                <Router>
                    {/* Set the website's title and favicon */}
                    <Helmet>
                        <title>FlightForge</title>
                        <link rel="icon" type="image/png" href={icon} />
                    </Helmet>
                    
                    {/* Define routes */}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/:user_id/review" element={<ReviewPage />} />
                        <Route path="/signin" element={<SignInPage />} />
                        <Route path="/CreateAccount" element={<CreateAccount />} />
                        <Route path="/userprofile" element={<UserProfile />} />
                        <Route path="/bookticket" element={<BookTicket />} />
                    </Routes>
                </Router>
            </div>
        </RouteContextProvider>
    );
};

export default App;
