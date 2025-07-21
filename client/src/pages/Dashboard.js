import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import axios from 'axios';

const Dashboard = () => {
  const [user, loading, error] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (user) {
      user.getIdToken().then(idToken => {
        // Verify token
        axios.post(`${process.env.REACT_APP_API_URL}/api/verify-token`, { idToken })
          .then(response => console.log('Verified:', response.data))
          .catch(error => {
            console.error('Verification error:', error);
            setFetchError('Failed to verify user');
          });

        // Fetch user data
        axios.get(`${process.env.REACT_APP_API_URL}/api/users/${user.uid}`, {
          headers: { Authorization: `Bearer ${idToken}` }
        })
          .then(res => {
            setUserData(res.data);
            setIsAdmin(res.data.isAdmin || false);
          })
          .catch(err => {
            console.error('Error fetching user data:', err.message);
            setFetchError('Failed to fetch user data: ' + err.message);
          });
      });
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (fetchError) return <div>Error: {fetchError}</div>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Dashboard</h2>
      <p>Welcome{user ? `, ${user.displayName || user.email}` : ''}!</p>
      <ul>
        <li><Link to="/quizzes">Take a Quiz</Link></li>
        <li><Link to="/results">View Results</Link></li>
        {isAdmin && <li><Link to="/admin/quiz-create">Create a Quiz</Link></li>}
      </ul>
    </div>
  );
};

export default Dashboard;