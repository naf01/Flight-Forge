import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RouteFinder from '../apis/RouteFinder';
import { useEffect } from 'react';

const ReviewForm = ({ routeId }) => {
    const [reviewMessage, setReviewMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    let route_id = localStorage.getItem('route_id');
    let airplane_name = localStorage.getItem('airplane_name');

    useEffect(() => {
      const fetchUserTickets = async () => {
          route_id = localStorage.getItem('route_id');
          localStorage.removeItem('airplane_name');
          localStorage.removeItem('route_id');
          try {
              const response = await RouteFinder.post('/user/authenticate', {
                  token: localStorage.getItem('token')
              });
              console.log(response.status);
              if (response.status === 200) {
              } else {
                  navigate('/');
              }
          } catch (error) {
              navigate('/');
          }
      };

      fetchUserTickets();
  }, []);

  const handleSignOut = () => {
      localStorage.removeItem('token');
      navigate('/');
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await RouteFinder.post(`/user/review`, {
                id: 0,
                route_id: routeId,
                token: route_id,
                message: reviewMessage,
                rating: rating
            });
            alert('Review submitted successfully!');
            navigate('/userticket');
        } catch (error) {
            console.error('Error submitting review:', error);
            setError('Failed to submit review. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-title text-center">{airplane_name}</h6>
                            <h5 className="card-title text-center">Write Your Review</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="reviewMessage" className="form-label">Review Message</label>
                                    <textarea
                                        className="form-control"
                                        id="reviewMessage"
                                        rows="3"
                                        value={reviewMessage}
                                        onChange={(e) => setReviewMessage(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="rating" className="form-label">Rating (out of 5)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="rating"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={rating}
                                        onChange={(e) => setRating(parseFloat(e.target.value))}
                                        required
                                    />
                                </div>
                                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewForm;
