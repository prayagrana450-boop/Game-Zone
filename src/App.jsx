
import { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import Leaderboard from './pages/Leaderboard';
import PuzzleChallenge from './games/PuzzleChallenge';
import ReactionSpeed from './games/ReactionSpeed';
import NumberGuess from './games/NumberGuess';
import MemoryMatch from './games/MemoryMatch';

import {
  getPlayerName,
  setPlayerName
} from './scoreUtils';

import { playSound } from './soundUtils';
import './App.css';

function Home() {
  const [playerName, updatePlayerName] = useState(getPlayerName());

  const games = [
    {
      icon: '🧠',
      name: 'Memory Match',
      description: 'Test your memory skills',
      path: '/memory-match'
    },
    {
      icon: '🔢',
      name: 'Number Guess',
      description: 'Guess the hidden number',
      path: '/number-guess'
    },
    {
      icon: '⚡',
      name: 'Reaction Speed',
      description: 'Test your reaction time',
      path: '/reaction-speed'
    },
    {
      icon: '🧩',
      name: 'Puzzle Challenge',
      description: 'Solve the puzzle in fewer moves',
      path: '/puzzle-challenge'
    }
  ];

  function handleNameChange(event) {
    updatePlayerName(event.target.value);
  }

  function handleSaveName(event) {
    event.preventDefault();

    if (!playerName.trim()) {
      alert('Please enter your player name.');
      return;
    }

    setPlayerName(playerName);
    updatePlayerName(playerName.trim());

    playSound('success');
    alert('Player name saved!');
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link
          to="/"
          className="brand"
          onClick={() => playSound('click')}
        >
          🎮 GameZone
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            onClick={() => playSound('click')}
          >
            Home
          </Link>

          <Link
            to="/leaderboard"
            onClick={() => playSound('click')}
          >
            🏆 Leaderboard
          </Link>
        </div>
      </nav>

      <header className="hero">
        <p className="eyebrow">PLAY • COMPETE • WIN</p>

        <h1>Welcome to GameZone!</h1>

        <p>
          Play fun mini-games and climb the leaderboard.
        </p>

        <form
          className="player-form"
          onSubmit={handleSaveName}
        >
          <label htmlFor="playerName">
            Your player name
          </label>

          <div className="player-input-row">
            <input
              id="playerName"
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={handleNameChange}
              maxLength={24}
            />

            <button type="submit">
              Save Name
            </button>
          </div>
        </form>
      </header>

      <main className="games-section">
        <div className="section-heading">
          <div>
            <h2>Choose Your Game</h2>

            <p>
              Ready, {playerName.trim() || 'Player'}?
              Let's play!
            </p>
          </div>

          <Link
            to="/leaderboard"
            className="leaderboard-button"
            onClick={() => playSound('click')}
          >
            🏆 View Top 10
          </Link>
        </div>

        <div className="games-grid">
          {games.map((game) => (
            <article
              className="game-card"
              key={game.path}
            >
              <div className="game-icon">
                {game.icon}
              </div>

              <h3>{game.name}</h3>

              <p>{game.description}</p>

              <Link
                className="play-button"
                to={game.path}
                onClick={() => playSound('click')}
              >
                Play Now →
              </Link>
            </article>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>🎮 GameZone — Play. Improve. Lead.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/memory-match"
          element={<MemoryMatch />}
        />

        <Route
          path="/number-guess"
          element={<NumberGuess />}
        />

        <Route
          path="/reaction-speed"
          element={<ReactionSpeed />}
        />

        <Route
          path="/puzzle-challenge"
          element={<PuzzleChallenge />}
        />

        <Route
          path="/leaderboard"
          element={<Leaderboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
