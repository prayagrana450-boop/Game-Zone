
const SCORES_KEY = 'gamezoneScores';
const PLAYER_KEY = 'gamezonePlayerName';

export function getPlayerName() {
  return localStorage.getItem(PLAYER_KEY) || 'Player';
}

export function setPlayerName(name) {
  const cleanedName = name.trim();

  if (cleanedName) {
    localStorage.setItem(PLAYER_KEY, cleanedName);
  }
}

export function saveGameScore(game, score) {
  const scores = JSON.parse(localStorage.getItem(SCORES_KEY) || '[]');

  scores.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    player: getPlayerName(),
    game,
    score: Number(score),
    date: new Date().toLocaleDateString()
  });

  localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
}

export function getTopScores(limit = 10) {
  const scores = JSON.parse(localStorage.getItem(SCORES_KEY) || '[]');

  return scores
    .filter(item => Number.isFinite(Number(item.score)))
    .sort((a, b) => Number(b.score) - Number(a.score))
    .slice(0, limit);
}
