export class ToneGenerator {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  async initialize(): Promise<void> {
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    this.gainNode.gain.value = 0.1; // Default volume
  }

  play(frequency: number): void {
    if (!this.audioContext || !this.gainNode) return;

    this.stop();

    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.frequency.value = frequency;
    this.oscillator.type = 'sine';
    this.oscillator.connect(this.gainNode);
    this.oscillator.start();
    this.isPlaying = true;
  }

  stop(): void {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
    this.isPlaying = false;
  }

  setVolume(volume: number): void {
    if (this.gainNode) {
      // Convert to logarithmic scale for better volume control
      this.gainNode.gain.value = Math.pow(volume, 2) * 0.3;
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  destroy(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

export function frequencyFromNote(note: string, octave: number): number {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteIndex = noteNames.indexOf(note);
  
  if (noteIndex === -1) return 440; // Default to A4
  
  // Calculate frequency using A4 as reference
  const A4 = 440;
  const semitonesFromA4 = (octave - 4) * 12 + (noteIndex - 9); // A is at index 9
  
  return A4 * Math.pow(2, semitonesFromA4 / 12);
} 