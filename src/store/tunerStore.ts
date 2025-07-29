import { create } from 'zustand';

type TunerState = {
  isListening: boolean;
  currentFrequency: number;
  detectedNote: string;
  centsOff: number;
};

type ToneGeneratorState = {
  selectedNote: string;
  selectedOctave: number;
  isPlaying: boolean;
};

type AppState = TunerState & ToneGeneratorState;

const useStore = create<AppState>(() => ({
  // Tuner state
  isListening: false,
  currentFrequency: 0,
  detectedNote: '',
  centsOff: 0,
  // Tone generator state
  selectedNote: 'A',
  selectedOctave: 4,
  isPlaying: false,
}));

// Tuner functions
export function startListening() {
  useStore.setState({ isListening: true });
}

export function stopListening() {
  useStore.setState({ isListening: false });
}

export function updateFrequency(frequency: number, note: string, centsOff: number) {
  useStore.setState({
    currentFrequency: frequency,
    detectedNote: note,
    centsOff: centsOff,
  });
}

// Tone generator functions
export function setToneNote(note: string) {
  useStore.setState({ selectedNote: note });
}

export function setToneOctave(octave: number) {
  useStore.setState({ selectedOctave: octave });
}

export function setTonePlaying(isPlaying: boolean) {
  useStore.setState({ isPlaying });
}

export function stopToneGeneration() {
  useStore.setState({ isPlaying: false });
}

// Combined state selectors
export function useTunerState() {
  return useStore((state) => ({
    isListening: state.isListening,
    currentFrequency: state.currentFrequency,
    detectedNote: state.detectedNote,
    centsOff: state.centsOff,
  }));
}

export function useToneGeneratorState() {
  return useStore((state) => ({
    selectedNote: state.selectedNote,
    selectedOctave: state.selectedOctave,
    isPlaying: state.isPlaying,
  }));
} 