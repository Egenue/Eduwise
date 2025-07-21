import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName });
      const idToken = await user.getIdToken();
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        uid: user.uid,
        email: user.email,
        displayName,
      }, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      console.log('User registered');
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
      console.error('Registration error:', error.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: 300 }}>
        <h2>Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Name"
            style={{ display: 'block', margin: '10px 0', width: '100%' }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ display: 'block', margin: '10px 0', width: '100%' }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ display: 'block', margin: '10px 0', width: '100%' }}
          />
          <button onClick={handleRegister} style={{ width: '100%' }}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;