import React, { useState } from 'react';
import './App.css';
import { Game } from './components/game';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '']);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (index: number, name: string) => {
    const updatedNames = [...playerNames];
    updatedNames[index] = name;
    setPlayerNames(updatedNames);
  };

  const handleStartGame = () => {
    if (playerNames.some((name) => name.trim() === '')) {
      setError('All player names must be filled out.');
      return;
    }
    setError(null);
    setGameStarted(true);
  };

  return (
    <div className="app-container">
      {!gameStarted ? (
        <div className="welcome-screen">
          <h1>Welcome to AzulVibe</h1>
          <p>A digital version of the Azul board game.</p>
          <div className="player-setup">
            <h2>Enter Player Names</h2>
            {playerNames.map((name, index) => (
              <div key={index} className="player-input">
                <label>Player {index + 1}:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`Player ${index + 1} Name`}
                />
              </div>
            ))}
            {error && <p className="error-message">{error}</p>}
            <button className="start-game-button" onClick={handleStartGame}>
              Start Game
            </button>
          </div>
        </div>
      ) : (
        <Game playerNames={playerNames} />
      )}
    </div>
  );
}

export default App;