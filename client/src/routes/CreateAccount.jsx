import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RouteFinder from '../apis/RouteFinder';
const CreateAccount = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [password, setPassword] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [error, setError] = useState('');

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await RouteFinder.post('/user/signup', {
                first_name: firstName,
                last_name: lastName,
                dateofbirth: dateOfBirth,
                mobileno: [mobileNo], // Convert mobileNo to an array
                password: password,
                city: city,
                country: country,
                zipcode: parseInt(zipcode) // Convert zipcode to integer
            });
            
            console.log(response.data);

            // Handle successful account creation, such as redirecting to another page
        } catch (err) {
            setError('Failed to create account. Please try again.');
            console.error('Error creating account:', err);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-danger text-white">
                            Create Account
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleCreateAccount}>
                                <div className="form-group">
                                    <label>First Name:</label>
                                    <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Last Name:</label>
                                    <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth:</label>
                                    <input type="date" className="form-control" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Mobile No:</label>
                                    <input type="text" className="form-control" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Password:</label>
                                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>City:</label>
                                    <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Country:</label>
                                    <input type="text" className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Zipcode:</label>
                                    <input type="number" className="form-control" value={zipcode} onChange={(e) => setZipcode(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn btn-danger btn-block">Create Account</button>
                            </form>
                            <Link to="/signin" className="btn btn-link mt-3">Already have an account? Sign In</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;
