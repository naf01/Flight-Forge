import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './routes/Home';
import {RouteContextProvider} from './context/RouteContext';
import ReviewPage from './routes/ReviewPage';
import SignInPage from './routes/SignInPage';
import CreateAccount from './routes/CreateAccount';
import UserProfile from './routes/UserProfile';
import BookTicket from './routes/BookTicket';

const App = () => {
    return (
    <RouteContextProvider>
        <div>
            <Router>
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
    
}
export default App;