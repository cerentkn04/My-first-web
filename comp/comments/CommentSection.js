'use client';

import { useState } from 'react';
import axios from 'axios';
import classes from './CommentSection.module.css';
import Popup from '../popup';

const CommentForm = ({ postId }) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setPopupMessage("Comment cannot be empty!");
      setIsPopupVisible(true); 
      return;
    }

    try {
      const response = await axios.post('/api/comments', {
        content: comment,
        post_id: postId,
      }, {
        withCredentials: true, 
      });

      if (response.status === 201) {
        setMessage('We got your comment!');
        setComment("");
      }
    } catch (error) {
      console.error("Error submitting comment", error);
      if (error.response?.status === 401) {
        setPopupMessage("You must be logged in to submit a comment.");
        setIsPopupVisible(true); 
      } else {
        setError("Failed to submit comment.");
        setPopupMessage("Failed to submit comment."); 
        setIsPopupVisible(true); 
      }
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className={classes.body}>
      <div className={classes.inputWrap}>
        <div className={classes.input}>
          <input 
            type="text" 
            value={comment} 
            onChange={handleCommentChange} 
            placeholder="Write your comment"
          />
          <button onClick={handleSubmit}>Submit</button>
        </div> 
        <div>{error && <p>{error}</p>}</div>
        <div>{message && <p>{message}</p>}</div>
      </div>
      {isPopupVisible && <Popup message={popupMessage} onClose={handleClosePopup} />}
    </div>
  );
};

export default CommentForm;
