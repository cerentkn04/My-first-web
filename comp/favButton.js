'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import classes from './favButton.module.css';  
const FavButton = ({ book }) => {
  const [favmessage, setFavMessage] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [listName, setListName] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(Cookies.get('token') || '');
  useEffect(() => {
    if (message || favmessage) {
      const timer = setTimeout(() => {
        setMessage('');
        setFavMessage('');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, favmessage]);


  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        
        return;
      }
      try {
        const response = await axios.get('/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  const handleFavClick = async () => {
    if (!token) {
      setMessage("You need to login")
      
      return;
    }
    try {
      const response = await axios.post('/api/addToList', {
        token,
        book,
        list: 'Favorites',
      });
      setFavMessage(response.data.message || 'Added to favorites!');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      setFavMessage('Failed to add to favorites');
    }
  };

  const handleListClick = () => {
    if (!token) {
      setMessage("You need to login");
      return;
    }
    setShowPopup(true);
  };

  const handlePopupSubmit = async (event) => {

    if (!token) {
      return;
    }

    try {
      const response = await axios.post('/api/addToList', {
        token,  
        book,   
        list: listName  
      });
      setMessage(response.data.message || 'List updated successfully!');
      setShowPopup(false);
    } catch (error) {
      console.error('Error adding to list:', error);
      setMessage('Failed to add book to list');
    }
  };

  return (
    <div>
      <div className={classes.wrapper}>
      <div  className={classes.Buttons}>
        <div>
          <button onClick={handleFavClick}  className={classes.favButton} >
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9932 5.13581C9.9938 2.7984 6.65975 2.16964 4.15469 4.31001C1.64964 6.45038 1.29697 10.029 3.2642 12.5604C4.89982 14.6651 9.84977 19.1041 11.4721 20.5408C11.6536 20.7016 11.7444 20.7819 11.8502 20.8135C11.9426 20.8411 12.0437 20.8411 12.1361 20.8135C12.2419 20.7819 12.3327 20.7016 12.5142 20.5408C14.1365 19.1041 19.0865 14.6651 20.7221 12.5604C22.6893 10.029 22.3797 6.42787 19.8316 4.31001C17.2835 2.19216 13.9925 2.7984 11.9932 5.13581Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div>
          <button onClick={handleListClick}>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
          {message && <div className={classes.message}>{message}</div>}
          {favmessage && <div  className={classes.message}>{favmessage}</div>}
      </div>

      {showPopup && (
        <div className={classes.popupOverlay}>
          <div className={classes.popupContent}>
            <h3>Add New List</h3>
            <form onSubmit={handlePopupSubmit}>
              <label>
                Add To:
                <div>
                  <ul>
                    {user &&
                      user.bookLists &&
                      user.bookLists.map((list, index) => (
                        <button type="button" onClick={()=> setListName(list.name)} key={index}>{list.name}</button>
                      ))}
                  </ul>
                </div>
              </label>
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="New List Name"
                className={classes.input}
              />
              <button type="submit" className={classes.submitBtn}>
                Submit
              </button>
              <button
                type="button"
                className={classes.closeBtn}
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavButton;
