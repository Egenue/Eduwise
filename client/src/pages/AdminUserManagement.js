import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAction = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    setMessage(''); setError('');
    try {
      const token = localStorage.getItem('token');
      let url = `http://localhost:5000/api/users/${id}`;
      let method = 'patch';
      if (action === 'promote') url += '/promote';
      else if (action === 'demote') url += '/demote';
      else if (action === 'delete') method = 'delete';
      await axios({ url, method, headers: { Authorization: `Bearer ${token}` } });
      setMessage(`User ${action}d successfully!`);
      fetchUsers();
    } catch (err) {
      setError(`Failed to ${action} user`);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h2>User Management</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {message && <div style={{ color: 'green' }}>{message}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.isAdmin ? 'Yes' : 'No'}</td>
              <td>
                {!u.isAdmin && <button onClick={() => handleAction(u._id, 'promote')}>Promote</button>}
                {u.isAdmin && <button onClick={() => handleAction(u._id, 'demote')}>Demote</button>}
                <button onClick={() => handleAction(u._id, 'delete')}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManagement; 