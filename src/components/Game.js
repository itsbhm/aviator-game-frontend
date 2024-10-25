import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from '../services/api';

const socket = io('http://localhost:5000'); // Your server URL

const Game = () => {
  const [gameId, setGameId] = useState(null);
  const [multiplier, setMultiplier] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [cashOutLoading, setCashOutLoading] = useState(false);
  const [error, setError] = useState('');
  const [betAmount, setBetAmount] = useState('');

  const startGame = async () => {
    if (!betAmount) {
      setError('Please enter a bet amount.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.post('/games/start', { betAmount });
      setGameId(response.data.gameId);
      setMultiplier(1.0); // Reset multiplier
      setBetAmount(''); // Clear bet amount after starting game
    } catch (err) {
      setError(err.response?.data.message || 'Failed to start game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.on('gameUpdate', (data) => {
      // Handle game updates
      setMultiplier(data.multiplier);
    });

    return () => {
      socket.off('gameUpdate');
    };
  }, []);

  const handleCashOut = async () => {
    setCashOutLoading(true);
    setError('');
    try {
      const response = await api.post(`/games/cashout`, { gameId });
      alert(`Cashed out at multiplier: ${response.data.winnings}`);
      setGameId(null); // Reset gameId after cashing out
    } catch (err) {
      setError(err.response?.data.message || 'Cash out failed. Please try again.');
    } finally {
      setCashOutLoading(false);
    }
  };

  return (
    <div>
      <h2>Aviator Game</h2>
      <input
        type="number"
        placeholder="Enter your bet amount"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
      />
      <button onClick={startGame} disabled={loading}>
        {loading ? 'Starting Game...' : 'Start Game'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {gameId && (
        <div>
          <p>Game ID: {gameId}</p>
          <p>Current Multiplier: {multiplier}</p>
          <button onClick={handleCashOut} disabled={cashOutLoading}>
            {cashOutLoading ? 'Cashing Out...' : 'Cash Out'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
