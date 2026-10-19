
import { Link } from 'react-router-dom';
import { getTopScores } from '../scoreUtils';
import '../App.css';

function Leaderboard() {
  const scores = getTopScores(10);

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="brand">🎮 GameZone</Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/leaderboard">🏆 Leaderboard</Link>
        </div>
      </nav>

      <main className="leaderboard-page">
        <div className="leaderboard-heading">
          <span className="trophy">🏆</span>
          <h1>Top 10 Leaderboard</h1>
          <p>Can you make it to the top?</p>
        </div>

        {scores.length === 0 ? (
          <div className="empty-leaderboard">
            <div className="empty-icon">🎮</div>
            <h2>No scores yet!</h2>
            <p>Play a game to earn your first leaderboard score.</p>
            <Link to="/" className="play-button">
              Explore Games →
            </Link>
          </div>
        ) : (
          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Game</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {scores.map((item, index) => (
                  <tr key={item.id || `${item.player}-${item.game}-${index}`}>
                    <td className="rank-cell">
                      {index === 0
                        ? '🥇'
                        : index === 1
                        ? '🥈'
                        : index === 2
                        ? '🥉'
                        : `#${index + 1}`}
                    </td>

                    <td className="player-cell">
                      {item.player || 'Player'}
                    </td>

                    <td>{item.game}</td>

                    <td className="score-cell">
                      {Number(item.score).toLocaleString()}
                    </td>

                    <td>{item.date || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="leaderboard-actions">
          <Link to="/" className="secondary-button">
            ← Back to Home
          </Link>
        </div>
      </main>

      <footer className="footer">
        <p>🎮 GameZone — Play. Improve. Lead.</p>
      </footer>
    </div>
  );
}

export default Leaderboard;
