import React, { useState, useEffect } from 'react';
import { Link, Route, useNavigate } from 'react-router-dom';
import RouteFinder from '../apis/RouteFinder';

const UserTicket = () => {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [ticketsPerPage, setTicketsPerPage] = useState(5);

    useEffect(() => {
        const fetchUserTickets = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('User ID or password not found.');
                    return;
                }

                const response = await RouteFinder.post('/user/tickets', { token: token });
                if (response.status === 200) {
                    setTickets(response.data.data.ticketinfo);
                    console.log(response.data.data.ticketinfo);
                } else {
                    setError('Failed to fetch user tickets.');
                }
            } catch (error) {
                setError('Failed to fetch user tickets. Please try again.');
            }
        };

        fetchUserTickets();
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleReview = async (routeId) => {
        const reviewMessage = prompt('Please provide your review message (max 255 characters):');
        if (reviewMessage === null) {
            // User canceled the prompt
            return;
        }
        if (reviewMessage.length > 255) {
            alert('Review message should not exceed 255 characters.');
            return;
        }
        const rating = prompt('Please provide your rating (out of 5):');
        if (rating === null) {
            // User canceled the prompt
            return;
        }
        const numericRating = parseFloat(rating);
        if (isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
            alert('Please provide a valid rating between 0 and 5.');
            return;
        }

        // Now you can send the review to your backend API
        try {
            const token = localStorage.getItem('token');
            console.log('routeId:', routeId);
            const response = await RouteFinder.post('/user/review', {
                id: 0,
                token: token,
                route_id: routeId,
                message: reviewMessage,
                rating: numericRating
            });
            if (response.status === 200) {
                alert('Review submitted successfully.');
                // Optionally, you can update the UI to reflect the submitted review
            } else {
                alert('Failed to submit review. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        }
    };

    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

    const renderTicketTables = () => {
        return (
            <div>
                {currentTickets.map((transit, index) => (
                    <div key={index} className="card shadow mb-4 mx-auto" style={{ width: '75%' }}>
                        <div className="card-body">
                            <h5 className="card-title">User Info</h5>
                            <table className="table table-striped">
                                <tbody>
                                    <tr>
                                        <td>Fullname:</td>
                                        <td>{transit[0].fullname}</td>
                                    </tr>
                                    <tr>
                                        <td>Email:</td>
                                        <td>{transit[0].email}</td>
                                    </tr>
                                    <tr>
                                        <td>Date of Birth:</td>
                                        <td>{transit[0].dateofbirth}</td>
                                    </tr>
                                    <tr>
                                        <td>Country:</td>
                                        <td>{transit[0].country}</td>
                                    </tr>
                                    <tr>
                                        <td>City:</td>
                                        <td>{transit[0].city}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            {new Date(transit[0].journeydate) - new Date() > 1000 * 60 * 60 * 24 * 10 ? (
                                                <button className="btn btn-primary" onClick={() => handleReturnTicket(transit[0])}>Return Ticket</button>
                                            ) : (
                                                <button className="btn btn-secondary" disabled>Return Ticket</button>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <h5 className="card-title">Tickets</h5>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Journey Date</th>
                                        <th>Seat No</th>
                                        <th>Amount</th>
                                        <th>Passport Number</th>
                                        <th>Buy Date</th>
                                        <th>Transaction ID</th>
                                        <th>Review</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transit.map(ticket => (
                                        <tr key={ticket.ticket_id}>
                                            <td>{ticket.journeydate.split('T')[0].trim()} , {ticket.journeydate.split('T')[1].split('.')[0].trim()}</td>
                                            <td>{ticket.seatno}</td>
                                            <td>{ticket.amount}</td>
                                            <td>{ticket.passportnumber}</td>
                                            <td>{ticket.buydate.split('T')[0].trim()} , {ticket.buydate.split('T')[1].split('.')[0].trim()}</td>
                                            <td>{ticket.transactionid}</td>
                                            <td>
                                                {new Date() - new Date(ticket.journeydate) > 1000 * 60 * 60 * 24 ? (
                                                    <button className="btn btn-primary" onClick={() => handleReview(ticket.route_id)}>Give a review</button>
                                                ) : (
                                                    <button className="btn btn-secondary" disabled>Take Our Flight First</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        );
    };                  

    const handleReturnTicket = async (ticket) => {
        const confirmReturn = window.confirm('Are you sure you want to return this ticket?');
        if (confirmReturn) {
            try {
                const response = await RouteFinder.post('/user/returnticket', {
                    id: ticket.id,
                });
                if (response.status === 200) {
                    alert('Ticket returned successfully.');
                    window.location.reload();
                } else {
                    alert('Failed to return ticket. Please try again.');
                }
            } catch (error) {
                console.error('Error returning ticket:', error);
                alert('Failed to return ticket. Please try again.');
            }
        } else {
            alert('Ticket return canceled by user.');
        }
    };    

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(tickets.length / ticketsPerPage); i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => (
        <li key={number} className="page-item">
            <a onClick={() => setCurrentPage(number)} href="!#" className="page-link">
                {number}
            </a>
        </li>
    ));

    const handleTicketsPerPageChange = e => {
        setTicketsPerPage(parseInt(e.target.value));
    };

    const nextPage = () => {
        if (currentPage < Math.ceil(tickets.length / ticketsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <Link style={{
                color: 'white', 
                backgroundColor: '#800000', 
                padding: '15px 20px', // Adjust padding here
                borderRadius: '5px',
                cursor: 'pointer',
                textDecoration: 'none', 
                fontSize: '16px', 
                transition: 'background-color 0.3s',
                position: 'absolute',
                top: '3%',
                right: '3%',
                marginTop: '10px',
            }} to="/">Go to Home</Link>
            <button style={{
                color: 'white', 
                backgroundColor: '#800000', 
                padding: '15px 20px', // Adjust padding here
                borderRadius: '5px',
                cursor: 'pointer',
                textDecoration: 'none', 
                fontSize: '16px', 
                transition: 'background-color 0.3s',
                position: 'absolute',
                top: '3%',
                right: '14%',
                marginTop: '10px',
            }} onClick={handleSignOut}>Sign Out</button>

            <div className="container mt-4" style={{width: '21%', padding: '3%'}}>
                <div className="card text-center p-3 shadow-lg bg-light">
                    <select onChange={handleTicketsPerPageChange} className="form-select form-select-lg">
                        <option value="5">5 Tickets Per Page</option>
                        <option value="10">10 Tickets Per Page</option>
                        <option value="100">100 Tickets Per Page</option>
                    </select>
                </div>
            </div>
            <div className="text-center" style={{ paddingBottom: '3%'}}>
                <button className="btn btn-primary shadow mr-2" onClick={prevPage}>Previous</button>
                <span>Page {currentPage} out of {Math.ceil(tickets.length / ticketsPerPage)}</span>
                <button className="btn btn-primary shadow ml-2" onClick={nextPage}>Next</button>
            </div>
            {error && <p>Error: {error}</p>}
            {tickets.length > 0 ? (
                <div>
                    {renderTicketTables()}
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            {renderPageNumbers}
                        </ul>
                    </nav>
                </div>
            ) : (
                <p>No tickets found.</p>
            )}
        </div>
    );
};

export default UserTicket;
