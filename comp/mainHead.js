"use client";

import { useAuth } from '../contexts/AuthContext'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import classes from './mainHead.module.css'; 

export default function MainHead() {
  const authContext = useAuth(); 
  const { user, setUser } = authContext;
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className={classes.hehe}>
      <h1 className={classes.sitename}>Mimiyr</h1>
      <nav className={classes.navbar}>
        <ul>
          {user ? (
            <>
              <li><Link href="/myAccount">My Account</Link></li>
              <li><button onClick={handleLogout} className={classes.logoutButton}>
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M16 17L21 12M21 12L16 7M21 12H9M9 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

              </button></li>
            </>
          ) : (
            <li><Link href="/login">Login</Link></li>
          )}

        </ul>
      </nav>
    </header>
  );
}

