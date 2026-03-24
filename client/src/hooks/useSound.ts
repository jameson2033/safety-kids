/**
 * Hook for playing sound effects using Web Audio API
 * Creates simple beep sounds without external dependencies
 */

export function useSound() {
  const playSound = (type: 'correct' | 'incorrect' | 'celebration') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioContext.currentTime;

      if (type === 'correct') {
        // Correct answer: ascending beeps
        const frequencies = [523, 659, 784]; // C5, E5, G5
        frequencies.forEach((freq, i) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.3, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.15);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.15);
        });
      } else if (type === 'incorrect') {
        // Incorrect answer: low beep
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = 300;
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'celebration') {
        // Celebration: cheerful melody
        const melody = [
          { freq: 523, time: 0 },      // C5
          { freq: 659, time: 0.15 },   // E5
          { freq: 784, time: 0.3 },    // G5
          { freq: 1047, time: 0.45 },  // C6
          { freq: 784, time: 0.6 },    // G5
          { freq: 1047, time: 0.75 },  // C6
        ];
        melody.forEach(({ freq, time }) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.25, now + time);
          gain.gain.exponentialRampToValueAtTime(0.01, now + time + 0.12);
          osc.start(now + time);
          osc.stop(now + time + 0.12);
        });
      }
    } catch (error) {
      // Silently fail if audio context is not available
      console.debug('Audio context not available');
    }
  };

  return { playSound };
}
