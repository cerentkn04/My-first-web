"use client"
import { useState } from 'react';
import classes from './page.module.css';
import { useRouter } from 'next/navigation';

const AddUser = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true); 
  const router = useRouter();

  const handleReg = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!email.includes('@')) {
      setError('Email must contain "@" character.');
      return;
    }
    if (verifyPassword !== password) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password, email }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred during registration.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred during login.');
    }
  };

  return (
    <div className={classes.page}>
      <div className={classes.board}>
        <div className={`${classes.formContainer} ${isLogin ? classes.showLogin : classes.showSignUp}`}>
          <form className={classes.form} onSubmit={handleLogin}>
            <h1>Login</h1>
            <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            {error && <div>{error}</div>}
            <button type="submit">Login</button>
            <span>Don't Have an Account?</span>
            <button type="button" onClick={() => setIsLogin(false)}>Sign Up</button>
          </form>
          <form className={classes.form} onSubmit={handleReg}>
            <h1>Sign Up</h1>
            <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <input type="password" onChange={(e) => setVerifyPassword(e.target.value)} placeholder="Verify Password" />
            {error && <div>{error}</div>}
            <button type="submit">Sign Up</button>
            <span>Already have an Account?</span>
            <button type="button" onClick={() => setIsLogin(true)}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
