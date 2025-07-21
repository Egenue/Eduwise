import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import axios from 'axios';

const Dashboard = () => {
  const [user, loading, error] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      user.getIdToken().then(idToken => {
        axios.post('http://localhost:5000/api/verify-token', { idToken })
          .then(response => console.log('Verified:', response.data))
          .catch(error => console.error('Verification error:', error));
      });
      axios.get(`http://localhost:5000/api/users/${user.uid}`)
        .then(res => {
          setUserData(res.data);
          setIsAdmin(res.data.isAdmin);
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
        });
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Dashboard</h2>
      <p>Welcome{user ? `, ${user.name || user.email}` : ''}!</p>
      <ul>
        <li><Link to="/quizzes">Take a Quiz</Link></li>
        <li><Link to="/results">View Results</Link></li>
        {isAdmin && <li><Link to="/admin/quiz-create">Create a Quiz</Link></li>}
      </ul>
    </div>
  );
};
