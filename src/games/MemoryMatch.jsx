
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { saveGameScore } from '../scoreUtils'
import { playSound } from '../soundUtils'
import '../App.css'

const EMOJIS = ['🍎', '🚀', '🎮', '🌟', '🐼', '🎵', '⚽', '🍕']

function createCards() {
  return [...EMOJIS, ...EMOJIS]
    .map((emoji, index) => ({ id: index, emoji }))
    .sort(() => Math.random() - 0.5)
}

export default function MemoryMatch() {
  const [cards, setCards] = useState(createCards)
  const [selected, setSelected] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(null)
  const [wrongPair, setWrongPair] = useState([])
  const [soundOn, setSoundOn] = useState(true)

  const lockRef = useRef(false)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function sound(type) {
    if (soundOn) playSound(type)
  }

  function handleCardClick(index) {
    if (
      gameOver ||
      lockRef.current ||
      selected.includes(index) ||
      matched.includes(index)
    ) {
      return
    }

    sound('click')

    if (selected.length === 0) {
      setSelected([index])
      return
    }

    const firstIndex = selected[0]
    const newMoves = moves + 1
    setMoves(newMoves)

    if (cards[firstIndex].emoji === cards[index].emoji) {
      const newMatched = [...matched, firstIndex, index]
      setMatched(newMatched)
      setSelected([])
      sound('match')

      if (newMatched.length === cards.length) {
        const points = Math.max(10, 500 - newMoves * 10)

        setScore(points)
        setGameOver(true)
        sound('win')
        saveGameScore('Memory Match', points)
      }
    } else {
      setSelected([firstIndex, index])
      setWrongPair([firstIndex, index])
      lockRef.current = true
      sound('wrong')

      timerRef.current = setTimeout(() => {
        setSelected([])
        setWrongPair([])
        lockRef.current = false
      }, 850)
    }
  }

  function restartGame() {
    if (timerRef.current) clearTimeout(timerRef.current)

    lockRef.current = false
    setCards(createCards())
    setSelected([])
    setMatched([])
    setMoves(0)
    setGameOver(false)
    setScore(null)
    setWrongPair([])
    sound('click')
  }

  return (
    <div className="memory-page">
      <div className="memory-container">
        <Link
          to="/"
          className="memory-back"
          onClick={() => sound('click')}
        >
          ← Back to Home
        </Link>

        <section className="memory-panel">
          <div className="memory-header">
            <div className="memory-logo">🧠</div>
            <p className="memory-eyebrow">BRAIN TRAINING • MINI GAME</p>
            <h1>Memory Match</h1>
            <p className="memory-description">
              Find matching emoji pairs. Remember their positions,
              sharpen your memory and beat your best score!
            </p>

            <button
              className="sound-toggle"
              onClick={() => {
                setSoundOn((current) => !current)
                if (!soundOn) playSound('success')
              }}
            >
              {soundOn ? '🔊 Sound On' : '🔇 Sound Off'}
            </button>
          </div>

          <div className="memory-stats">
            <div className="memory-stat">
              <span>🎯</span>
              <p>Moves</p>
              <strong>{moves}</strong>
            </div>

            <div className="memory-stat">
              <span>✨</span>
              <p>Pairs Found</p>
              <strong>{matched.length / 2} / {EMOJIS.length}</strong>
            </div>

            <div className="memory-stat">
              <span>🏆</span>
              <p>Current Score</p>
              <strong>
                {score ?? Math.max(0, 500 - moves * 10)}
              </strong>
            </div>
          </div>

          <div className="memory-progress">
            <div
              className="memory-progress-fill"
              style={{
                width: `${(matched.length / cards.length) * 100}%`
              }}
            />
          </div>

          <div className="memory-grid">
            {cards.map((card, index) => {
              const isVisible =
                selected.includes(index) || matched.includes(index)

              const isMatched = matched.includes(index)
              const isWrong = wrongPair.includes(index)

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  disabled={gameOver || isMatched}
                  aria-label={isVisible ? card.emoji : 'Hidden card'}
                  className={[
                    'memory-card',
                    isVisible ? 'memory-card-open' : '',
                    isMatched ? 'memory-card-matched' : '',
                    isWrong ? 'memory-card-wrong' : ''
                  ].join(' ')}
                >
                  <span className="memory-card-face">
                    {isVisible ? card.emoji : '❔'}
                  </span>
                </button>
              )
            })}
          </div>

          {gameOver && (
            <div className="memory-win">
              <div className="memory-win-icon">🏆</div>
              <h2>Awesome! You did it!</h2>
              <p>All pairs matched successfully.</p>
              <div className="memory-final-score">
                Your Score: {score}
              </div>
              <p className="memory-win-note">
                Your score has been submitted to the leaderboard.
              </p>
            </div>
          )}

          <button
            onClick={restartGame}
            className="memory-restart"
          >
            {gameOver ? '🔄 Play Again' : '↻ Restart Game'}
          </button>

          <p className="memory-tip">
            💡 Tip: Focus on the emoji positions to match pairs faster.
          </p>
        </section>
      </div>
    </div>
  )
}
