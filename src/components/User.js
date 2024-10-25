import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const User = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // Hook for navigation

  // Check for stored token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await api.post('/users/register', { username, password });
      setMessage(response.data.message);
      setUsername('');
      setPassword('');
    } catch (error) {
      setMessage(error.response?.data.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post('/users/login', { username, password });
      localStorage.setItem('token', response.data.token); // Store token in localStorage
      setToken(response.data.token);
      setMessage('Login successful!');
      navigate('/games'); // Redirect to the games page
    } catch (error) {
      setMessage(error.response?.data.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
    setToken('');
    setMessage('Logged out successfully.');
    setUsername(''); // Clear input fields
    setPassword('');
  };

  return (
    <div>
      <h2>User Authentication</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister} disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <button onClick={handleLogout} disabled={!token}>
        Logout
      </button>
      {token && <p>Logged in! Token: {token}</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default User;
