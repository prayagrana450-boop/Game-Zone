
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saveGameScore } from '../scoreUtils';
import { playSound } from '../soundUtils';
import '../App.css';

export default function ReactionSpeed() {
  const [phase, setPhase] = useState('ready');
  const [reactionTime, setReactionTime] = useState(null);
  const [bestTime, setBestTime] = useState(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  function startGame() {
    clearTimeout(timerRef.current);
    setReactionTime(null);
    setPhase('waiting');
    playSound('click');

    const delay = Math.floor(Math.random() * 3000) + 2000;

    timerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setPhase('go');
      playSound('success');
    }, delay);
  }

  function handleClick() {
    if (phase === 'ready' || phase === 'result' || phase === 'tooSoon') {
      startGame();
      return;
    }

    if (phase === 'waiting') {
      clearTimeout(timerRef.current);
      setPhase('tooSoon');
      playSound('wrong');
      return;
    }

    if (phase === 'go') {
      const time = Math.round(performance.now() - startTimeRef.current);
      const points = Math.max(10, 1000 - time);

      setReactionTime(time);
      setBestTime((previous) =>
        previous === null ? time : Math.min(previous, time)
      );
      setPhase('result');
      saveGameScore('Reaction Speed', points);
      playSound('win');
    }
  }

  return (
    <main className="mini-game-page reaction-page">
      <div className="mini-game-container">
        <Link className="back-link" to="/">
          ← Back to Home
        </Link>

        <section className="mini-game-panel">
          <p className="game-eyebrow">⚡ TEST YOUR REFLEXES</p>
          <h1>Reaction Speed</h1>
          <p className="game-description">
            Wait for green, then click as quickly as possible!
          </p>

          <button
            type="button"
            className={`reaction-zone reaction-${phase}`}
            onClick={handleClick}
          >
            {phase === 'ready' && (
              <>
                <span className="reaction-emoji">⚡</span>
                <strong>Click to Start</strong>
              </>
            )}

            {phase === 'waiting' && (
              <>
                <span className="reaction-emoji">⏳</span>
                <strong>Wait for Green...</strong>
                <small>Don't click yet!</small>
              </>
            )}

            {phase === 'go' && (
              <>
                <span className="reaction-emoji">🟢</span>
                <strong>CLICK NOW!</strong>
              </>
            )}

            {phase === 'tooSoon' && (
              <>
                <span className="reaction-emoji">❌</span>
                <strong>Too Early!</strong>
                <small>Click to try again</small>
              </>
            )}

            {phase === 'result' && (
              <>
                <span className="reaction-emoji">🎉</span>
                <strong>{reactionTime} ms</strong>
                <small>Click to play again</small>
              </>
            )}
          </button>

          <div className="reaction-stats">
            <div className="reaction-stat">
              <span>Your Reaction</span>
              <strong>
                {reactionTime !== null ? `${reactionTime} ms` : '—'}
              </strong>
            </div>

            <div className="reaction-stat">
              <span>Personal Best</span>
              <strong>{bestTime !== null ? `${bestTime} ms` : '—'}</strong>
            </div>
          </div>

          <p className="reaction-tip">
            💡 Tip: A lower reaction time is better!
          </p>
        </section>
      </div>
    </main>
  );
}
