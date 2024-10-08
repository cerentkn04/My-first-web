"use client";

import { useAuth } from '../../contexts/AuthContext'; 
import { useState, useEffect } from 'react';
import classes from './page.module.css';
import MyAccSideBar from '../../comp/MyAccountSidebar';
import Settings from '../../comp/MyAccountPage/setting';
import Account from '../../comp/MyAccountPage/account';
import Library from '../../comp/MyAccountPage/library';
import Social from '../../comp/MyAccountPage/social';
import MyActivity from '../../comp/MyAccountPage/MyActivity'

export default function MyAccount() {
  const [PageToLoad, setPageToLoad] = useState('');
  const [fetchedUser, setFetchedUser] = useState(null);
  const authContext = useAuth();
  const { user } = authContext;

  useEffect(() => {
    console.log("users email is hopefully: " ,user?.Email)
    const fetchUserInfo = async () => {
      if (user?.Email) {
        try {
          const response = await fetch(`/api/tokenlesUser?email=${user.Email}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user information');
          }
          const data = await response.json();
          setFetchedUser(data);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  const handlePageToLoad = (a_page) => {
    setPageToLoad(a_page);
  };

  const renderPageContent = () => {
    switch (PageToLoad) {
      case 'Settings':
        return <Settings user ={fetchedUser || user} onBackToAccount={() => handlePageToLoad('Account')}  />;
      case 'Social':
        return <Social user={fetchedUser || user} onBackToAccount={() => handlePageToLoad('Account') }/>;
      case 'Library':
        return <Library  user={fetchedUser || user} onBackToAccount={() => handlePageToLoad('Account') }/>;
        case 'My Activity':
        return <MyActivity  user={fetchedUser || user} onBackToAccount={() => handlePageToLoad('Account') }/>;
      default:
        return <Account user={fetchedUser || user} onBackToAccount={() => handlePageToLoad('Account') } />;
    }
  };

  if (!user) {
    return <p>Please log in to view your account information.</p>;
  }

  return (
    <div className={classes.page}>
      <header className={classes.head}>
        <h1>Mimiyr</h1>
      </header>
      <div className={classes.main}>
        <div className={classes.SideBar}>
          <MyAccSideBar pageToLoad={handlePageToLoad} />
        </div>
        <div className={classes.subpage}>
          {renderPageContent()}
        </div>
      </div>
    </div>
  );
}
