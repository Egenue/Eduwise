import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission refresh
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      // Sync user data with MongoDB
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
        },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      console.log('User logged in');
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
      console.error('Login error:', error.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: 300 }}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{ display: 'block', margin: '10px 0', width: '100%' }}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{ display: 'block', margin: '10px 0', width: '100%' }}
              required
            />
          </div>
          <button type="submit" style={{ width: '100%', margin: '10px 0' }}>
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;