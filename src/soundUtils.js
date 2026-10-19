
let audioContext;

function getAudioContext() {
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) return null;

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  return audioContext;
}

export function playSound(type = 'click') {
  try {
    const context = getAudioContext();
    if (!context) return;

    const sounds = {
      click: { frequency: 500, duration: 0.07, wave: 'sine' },
      success: { frequency: 880, duration: 0.18, wave: 'sine' },
      match: { frequency: 660, duration: 0.12, wave: 'triangle' },
      wrong: { frequency: 180, duration: 0.18, wave: 'triangle' },
      win: { frequency: 1046, duration: 0.3, wave: 'sine' }
    };

    const sound = sounds[type] || sounds.click;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = sound.wave;
    oscillator.frequency.setValueAtTime(
      sound.frequency,
      context.currentTime
    );

    gain.gain.setValueAtTime(0.15, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + sound.duration
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + sound.duration);
  } catch (error) {
    console.warn('Sound could not play:', error);
  }
}
