'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classes from './Ratecomp.module.css'


const Rating = ({ book_Id }) => {
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);
  const[message, setMessage] = useState("")


  useEffect(() => {
    
    const fetchRatingData = async () => {
      try {
        const response = await axios.get(`/api/${book_Id}/rateCalculation`);
        setAverageRating(response.data.averageRating||0);
        setRatingsCount(response.data.ratingsCount||0);
      } catch (error) {
        console.error('Error fetching rating data:', error);
      }
    };

    fetchRatingData();
  }, [book_Id]);

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/rate', {
        book_Id,
        rating,
      });
      setMessage('your rate is submitted')
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };
  

  return (
    <div className={classes.skeleton}>
      <div className={classes.sub0}>
        <h2>Rate this Book</h2>
        <div className={classes.rate}>
          <label htmlFor="rating">Rate: </label>
          <input
            type="number"
            name="rating"
            min="0"
            max="5"
            value={rating}
            onChange={handleRatingChange}
          />
        </div>
          <button onClick={handleSubmit}>Submit Rating</button>
      </div>
      <div className={classes.sub0}>
          <p>Average Rating: {averageRating.toFixed(1)}</p>
          <p>Total Ratings: {ratingsCount}</p>
      </div>
      {message && <p>{message} </p>}
    </div>
  );
};

export default Rating;