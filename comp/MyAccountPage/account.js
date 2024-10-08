import { useEffect, useState } from 'react';
import axios from 'axios';
import classes from './account.module.css';

const Account = ({ user }) => {
  const [bookDetails, setBookDetails] = useState({}); 


  const fetchBookDetails = async (bookId) => {
    try {
      const response = await axios.get(`/api/bookimg?bookId=${bookId}`); 
      return response.data;
    } catch (error) {
      console.error('Error fetching book details:', error);
      return null;
    }
  };


  const loadBookDetails = async () => {
    if (user.bookLists) {
      const details = { ...bookDetails };
      for (const list of user.bookLists) {
        for (const bookId of list.books) {
          if (!details[bookId]) {
            const bookDetail = await fetchBookDetails(bookId);
            if (bookDetail) {
              details[bookId] = bookDetail; 
            }
          }
        }
      }
      setBookDetails(details);
    }
  };

  useEffect(() => {
    loadBookDetails();
  }, [user.bookLists]);

  const followers = user?.followers || [];
  const followings = user?.followings || [];

  return (
    <div className={classes.page}>
      <div className={classes.head}>
        <div className={classes.pfpwrapper}>
          <img src={user?.pfp || '/defaultpfp.png'} className={classes.pfp} />
        </div>
        <div className={classes.infowrapper}>
          <h2>{user.name}</h2>
          <div className={classes.infos}>
            <p>Email: {user.Email}</p>
            <p>Followers: {followers.length}</p>
            <p>Followings: {followings.length}</p>
          </div>
        </div>
      </div>
      <div className={classes.main}>
        <div>
          <h3>Book Lists:</h3>
          {user.bookLists && user.bookLists.length > 0 ? (
            <ul className={classes.booklists}>
              {user.bookLists.map((list, index) => (
                <li key={index} className={classes.booklistItem}>
                  <strong>{list.name}</strong>
                  <ul className={classes.books}>
                    {list.books.slice(0, 3).map((bookId, bookIndex) => (
                      <li key={bookIndex}>
                        {bookDetails[bookId] ? (
                          <p>{bookDetails[bookId].title}</p>
                        ) : (
                          <p>Loading...</p>
                        )}
                      </li>
                    ))}
                    <h3>...</h3>
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>No book lists available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
