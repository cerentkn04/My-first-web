'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { parseCookies } from 'nookies';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    console.log('useEffect triggered for user authentication check');
    const { token } = parseCookies();
    if (token) {
      fetch('/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        console.log('Response received:', res);
        return res.json();
      })
      .then(data => {
        console.log('Fetched User Data:', data);
        setUser(data.user);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setUser(null);
      });
    } else {
      console.log('No token found, setting user to null');
      setUser(null);
    }
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;

};
