import React, { useState, useContext } from 'react';
import { FaStar } from 'react-icons/fa';
import { AuthContext } from '../context/authContext.js';
import './starrating.css';

const StarRating = ({ onChangeHandler }) => {
  const { currentUser } = useContext(AuthContext);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  const handleRatingChange = (e) => {
    const ratingValue = parseInt(e.target.value);
    console.log(ratingValue);
    setRating(ratingValue);

    const requestData = {
      ratingValue,
      user_num: currentUser.user_num,
    };

    fetch('http://localhost:8800/saveRating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      // .then((data) => {
      //   console.log(data);
      // })
      .catch((error) => {
        console.error('Error:', error);
      });

    if (typeof onChangeHandler === 'function') {
      onChangeHandler(e);
    }
  };

  return (
    <div>
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        return (
          <label key={i}>
            <input className='rating' type='radio' name='star' value={ratingValue} onChange={handleRatingChange} onClick={() => setRating(ratingValue)} />
            <FaStar className='star' color={ratingValue <= (hover || rating) ? '#fcbe32' : '#e4e5e9'} size={40} onMouseEnter={() => setHover(ratingValue)} onMouseLeave={() => setHover(null)} />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
