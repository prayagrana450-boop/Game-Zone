
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveGameScore } from '../scoreUtils';
import { playSound } from '../soundUtils';
import '../App.css';

const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0];

function shuffleBoard() {
  const board = [...SOLVED];
  let empty = 8;
  let previousEmpty = -1;

  // Legal moves keep the puzzle solvable.
  for (let i = 0; i < 100; i++) {
    const neighbors = [
      empty - 3,
      empty + 3,
      ...(empty % 3 !== 0 ? [empty - 1] : []),
      ...(empty % 3 !== 2 ? [empty + 1] : []),
    ].filter(
      (position) =>
        position >= 0 &&
        position < 9 &&
        position !== previousEmpty
    );

    const next = neighbors[Math.floor(Math.random() * neighbors.length)];

    [board[empty], board[next]] = [board[next], board[empty]];
    previousEmpty = empty;
    empty = next;
  }

  if (board.every((number, index) => number === SOLVED[index])) {
    return shuffleBoard();
  }

  return board;
}

export default function PuzzleChallenge() {
  const [board, setBoard] = useState(() => shuffleBoard());
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  function handleTileClick(index) {
    if (won || board[index] === 0) return;

    const emptyIndex = board.indexOf(0);
    const sameRow = Math.floor(index / 3) === Math.floor(emptyIndex / 3);
    const sameColumn = index % 3 === emptyIndex % 3;
    const adjacent =
      (sameRow && Math.abs(index - emptyIndex) === 1) ||
      (sameColumn && Math.abs(index - emptyIndex) === 3);

    if (!adjacent) {
      playSound('wrong');
      return;
    }

    const updatedBoard = [...board];
    [updatedBoard[index], updatedBoard[emptyIndex]] = [
      updatedBoard[emptyIndex],
      updatedBoard[index],
    ];

    const newMoves = moves + 1;
    setBoard(updatedBoard);
    setMoves(newMoves);
    playSound('click');

    const completed = updatedBoard.every(
      (number, position) => number === SOLVED[position]
    );

    if (completed) {
      setWon(true);
      const points = Math.max(50, 500 - newMoves * 10);
      saveGameScore('Puzzle Challenge', points);
      playSound('win');
    }
  }

  function restartGame() {
    setBoard(shuffleBoard());
    setMoves(0);
    setWon(false);
    playSound('click');
  }

  return (
    <main className="mini-game-page puzzle-page">
      <div className="mini-game-container">
        <Link className="back-link" to="/">
          ← Back to Home
        </Link>

        <section className="mini-game-panel">
          <p className="game-eyebrow">🧩 THINK • SLIDE • SOLVE</p>
          <h1>Puzzle Challenge</h1>
          <p className="game-description">
            Arrange the numbers from 1 to 8 in the correct order.
            Tap a tile next to the empty space to move it.
          </p>

          <div className="puzzle-stats">
            <div className="reaction-stat">
              <span>Moves</span>
              <strong>{moves}</strong>
            </div>
            <div className="reaction-stat">
              <span>Status</span>
              <strong>{won ? 'Solved!' : 'Playing'}</strong>
            </div>
          </div>

          <div className="puzzle-board">
            {board.map((number, index) => (
              <button
                key={index}
                type="button"
                className={`puzzle-tile ${number === 0 ? 'puzzle-empty' : ''}`}
                onClick={() => handleTileClick(index)}
                disabled={won || number === 0}
                aria-label={number === 0 ? 'Empty space' : `Move tile ${number}`}
              >
                {number !== 0 && number}
              </button>
            ))}
          </div>

          {won && (
            <div className="puzzle-win">
              <span>🏆</span>
              <h2>Puzzle Solved!</h2>
              <p>You completed it in {moves} moves!</p>
              <p>Your score has been saved to the leaderboard.</p>
            </div>
          )}

          <button
            type="button"
            className="game-action-button"
            onClick={restartGame}
          >
            🔄 {won ? 'Play Again' : 'Restart Puzzle'}
          </button>
        </section>
      </div>
    </main>
  );
}
