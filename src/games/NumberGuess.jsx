
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { saveGameScore } from '../scoreUtils'
import { playSound } from '../soundUtils'
import '../App.css'

function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1
}

export default function NumberGuess() {
  const [secret, setSecret] = useState(getRandomNumber)
  const [guess, setGuess] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [message, setMessage] = useState('Enter a number between 1 and 100!')
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [score, setScore] = useState(0)
  const [history, setHistory] = useState([])

  function checkGuess(event) {
    event.preventDefault()

    const number = Number(guess)

    if (!guess.trim() || !Number.isInteger(number) || number < 1 || number > 100) {
      setMessage('⚠️ Enter a valid number from 1 to 100.')
      playSound('wrong')
      return
    }

    if (gameOver) return

    const newAttempts = attempts + 1
    setAttempts(newAttempts)
    setHistory((old) => [...old, number])
    setGuess('')

    if (number === secret) {
      const points = Math.max(50, 500 - (newAttempts - 1) * 40)

      setMessage(`🎉 Correct! The number was ${secret}.`)
      setScore(points)
      setWon(true)
      setGameOver(true)
      saveGameScore('Number Guess', points)
      playSound('win')
    } else if (number < secret) {
      setMessage('📈 Too low! Try a higher number.')
      playSound('wrong')
    } else {
      setMessage('📉 Too high! Try a lower number.')
      playSound('wrong')
    }
  }

  function restartGame() {
    setSecret(getRandomNumber())
    setGuess('')
    setAttempts(0)
    setMessage('Enter a number between 1 and 100!')
    setGameOver(false)
    setWon(false)
    setScore(0)
    setHistory([])
    playSound('click')
  }

  return (
    <div className="memory-page">
      <div className="memory-container">
        <Link to="/" className="memory-back">
          ← Back to Home
        </Link>

        <section className="memory-panel number-game">
          <div className="memory-header">
            <div className="memory-logo">🔢</div>
            <p className="memory-eyebrow">THINK • GUESS • WIN</p>
            <h1>Number Guess</h1>
            <p className="memory-description">
              Guess the secret number between 1 and 100.
              Every correct guess earns points!
            </p>
          </div>

          <div className="memory-stats">
            <div className="memory-stat">
              <span>🎯</span>
              <p>Attempts</p>
              <strong>{attempts}</strong>
            </div>
            <div className="memory-stat">
              <span>⭐</span>
              <p>Score</p>
              <strong>{score}</strong>
            </div>
            <div className="memory-stat">
              <span>🏆</span>
              <p>Status</p>
              <strong>{won ? 'Won!' : gameOver ? 'Over' : 'Playing'}</strong>
            </div>
          </div>

          <form onSubmit={checkGuess} className="number-form">
            <label htmlFor="numberGuess">Your guess</label>
            <input
              id="numberGuess"
              type="number"
              min="1"
              max="100"
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              placeholder="Enter 1–100"
              disabled={gameOver}
            />
            <button type="submit" disabled={gameOver}>
              Check Number →
            </button>
          </form>

          <div className={`number-message ${won ? 'number-success' : ''}`}>
            {message}
          </div>

          {history.length > 0 && (
            <div className="number-history">
              <h3>Your guesses</h3>
              <div className="guess-chips">
                {history.map((item, index) => (
                  <span key={`${item}-${index}`}>{item}</span>
                ))}
              </div>
            </div>
          )}

          {gameOver && (
            <div className="memory-win">
              <div className="memory-win-icon">🏆</div>
              <h2>Congratulations!</h2>
              <p>You found the secret number in {attempts} attempts.</p>
              <div className="memory-final-score">Score: {score}</div>
            </div>
          )}

          <button className="memory-restart" onClick={restartGame}>
            🔄 {gameOver ? 'Play Again' : 'Restart Game'}
          </button>
        </section>
      </div>
    </div>
  )
}
