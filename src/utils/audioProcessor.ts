import { PitchDetector } from 'pitchy';

export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private dataArray: Float32Array | null = null;
  private pitchDetector: PitchDetector<Float32Array> | null = null;
  private bufferLength = 0;
  private sampleRate = 0;

  async initialize(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext();
      this.sampleRate = this.audioContext.sampleRate;
      
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 8192;
      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Float32Array(this.bufferLength);
      
      // Initialize Pitchy detector for the buffer size
      this.pitchDetector = PitchDetector.forFloat32Array(this.bufferLength);
      
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);
    } catch (error) {
      throw new Error('Microphone access denied or not available');
    }
  }

  getFrequency(): number {
    if (!this.analyser || !this.dataArray || !this.pitchDetector) return 0;

    this.analyser.getFloatTimeDomainData(this.dataArray);
    
    const [pitch, clarity] = this.pitchDetector.findPitch(this.dataArray, this.sampleRate);
    
    // Only return pitch if clarity is above threshold (helps filter noise)
    return clarity > 0.9 ? pitch : 0;
  }

  destroy(): void {
    if (this.microphone) {
      this.microphone.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

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

export function noteFromFrequency(frequency: number): { note: string; centsOff: number } {
  const A4 = 440;
  const C0 = A4 * Math.pow(2, -4.75);
  
  if (frequency <= 0) return { note: '', centsOff: 0 };
  
  const halfSteps = Math.round(12 * Math.log2(frequency / C0));
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const note = noteNames[halfSteps % 12];
  
  const exactHalfSteps = 12 * Math.log2(frequency / C0);
  const centsOff = Math.round((exactHalfSteps - halfSteps) * 100);
  
  return { note, centsOff };
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