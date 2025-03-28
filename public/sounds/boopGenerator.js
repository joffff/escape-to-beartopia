// This file provides a function to generate a boop sound
// It can be used in browsers that support the Web Audio API

function generateBoop() {
  // Create audio context
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create oscillator for the boop sound
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Set parameters for a cute boop sound
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
  oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1); // Slide up to A5
  
  // Set volume envelope
  gainNode.gain.setValueAtTime(0.7, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
  
  // Start and stop
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.3);
  
  return audioContext;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateBoop };
}
