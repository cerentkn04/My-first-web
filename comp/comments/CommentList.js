'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import classes from './CommentList.module.css';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Popup from '../popup'; // Import the Popup component

const CommentsList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for the popup
  const [popupMessage, setPopupMessage] = useState(''); // State for the message
  const router = useRouter();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/displayComments?bookId=${postId}`);
        console.log('Fetched comments:', response.data);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Error loading comments');
      }
    };

    fetchComments();
  }, [postId]);

  const handleLinkClick = (userId) => {
    const token = Cookies.get('token') || '';
    if (token) {
      router.push(`/User2/${userId}`);
    } else {
      setPopupMessage('You need to be logged in to view user profiles.');
      setIsPopupVisible(true); 
    
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false); 
  };

  return (
    <div className={classes.bars}>
      {error && <p>{error}</p>}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className={classes.CommentBar}>
            <div
              className={classes.CommentorName}
              onClick={() => handleLinkClick(comment.userId?.name || 'Unknown User')}
            >
              <img
                src={comment.userId?.pfp ? comment.userId.pfp : '/defaultpfp.png'}
                alt="Description"
                width={50}
                height={50}
              />
            </div>
            <div>
              <div
                className={classes.CommentorName}
                onClick={() => handleLinkClick(comment.userId?.name || 'Unknown User')}
              >
                {comment.userId?.name ? comment.userId.name : 'Unknown User'}
              </div>
              <h5 className={classes.Comment}>{comment.content}</h5>
            </div>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
      {isPopupVisible && <Popup message={popupMessage} onClose={handleClosePopup} />}
    </div>
  );
};

export default CommentsList;
