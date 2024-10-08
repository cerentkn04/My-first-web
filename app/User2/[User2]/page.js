'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import classes from './page.module.css';

const UserPage = ({ params }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [uuser, setUuser] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const { User2 } = params;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/api/tokenlesUser', { params: { name: User2 } });
        setUuser(res.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    const checkFollowingStatus = async () => {
      const token = Cookies.get('token') || '';
      if (!token) return;

      try {
        const res = await axios.get('/api/checkFollowingStatus', {
          params: { targetUserName: User2 },
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFollowing(res.data.isFollowing);
      } catch (error) {
        console.error('Error checking follow status', error);
      }
    };

    fetchUserData();
    checkFollowingStatus();
  }, [User2]);

  const handleFollowClick = async () => {
    const token = Cookies.get('token') || '';
    if (!token) {
      setError('User not authenticated.');
      return;
    }
    if (!User2) {
      setError('User2 is undefined.');
      return;
    }

    try {
      const response = await axios.post(
        '/api/FollowAct',
        { targetUserName: User2 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setIsFollowing(!isFollowing);
      } else {
        throw new Error('Error following user');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to follow the user.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={classes.page}>
      <header className={classes.header}>
        <div className={classes.sub0}>
          <img src={uuser?.pfp || '/defaultpfp.png'} alt="User Profile" />
          <div>
            <p className={classes.username}>{uuser?.name || 'Unknown User'}</p>
            <div className={classes.follows}>
              <p>follows: {uuser.followings?.length || 0} / followers: {uuser.followers?.length || 0}</p>
            </div>
          </div>
        </div>
        <button onClick={handleFollowClick}>
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </header>
      <main className={classes.main}>
        <div className={classes.wrapper}>
          <h2>{uuser?.name}'s Book Lists</h2>
          <div className={classes.bookLists}>
            {uuser.bookLists && uuser.bookLists.length > 0 ? (
              uuser.bookLists.map((list, index) => {
                const shouldShowList =
                  list.visibility === 'public' ||
                  (list.visibility === 'private' && isFollowing);

                return (
                  shouldShowList && (
                    <div key={index} className={classes.listItem}>
                      <h3>{list.name || 'Unnamed List'}</h3>
                      <p>Number of books: {list.books?.length || 0}</p>
                      <div className={classes.Bookimgs}>
                        {list.books.slice(0, 3).map((book, bookIndex) => (
                          <img
                            key={bookIndex}
                            src={book?.image||'/defaultpfp.png'}
                            alt={book.title}
                            style={{ width: '100px', height: '150px' }}
                            className={`${classes.bookImage} ${classes[`bookImage${bookIndex}`]}`}
                          />
                        ))}
                      </div>
                    </div>
                  )
                );
              })
            ) : (
              <p>No book lists available.</p>
            )}
          </div>
        </div>
      </main>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UserPage;
