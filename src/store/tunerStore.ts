import { create } from 'zustand';

export type InstrumentType = 'guitar' | 'violin';

export type TuningConfig = {
  name: string;
  notes: string[];
  frequencies: number[];
};

export const tuningConfigs: Record<InstrumentType, TuningConfig> = {
  guitar: {
    name: 'Guitar (Standard)',
    notes: ['E', 'A', 'D', 'G', 'B', 'E'],
    frequencies: [82.4, 110.0, 146.8, 196.0, 246.9, 329.6],
  },
  violin: {
    name: 'Violin',
    notes: ['G', 'D', 'A', 'E'],
    frequencies: [196.0, 293.7, 440.0, 659.3],
  },
};

type TunerState = {
  isListening: boolean;
  currentFrequency: number;
  detectedNote: string;
  centsOff: number;
  selectedInstrument: InstrumentType;
  targetNote: string;
  targetFrequency: number;
};

type ToneGeneratorState = {
  selectedNote: string;
  selectedOctave: number;
  volume: number;
  isPlaying: boolean;
};

type AppState = TunerState & ToneGeneratorState;

const useStore = create<AppState>(() => ({
  // Tuner state
  isListening: false,
  currentFrequency: 0,
  detectedNote: '',
  centsOff: 0,
  selectedInstrument: 'guitar',
  targetNote: 'E',
  targetFrequency: 82.4,
  // Tone generator state
  selectedNote: 'A',
  selectedOctave: 4,
  volume: 0.3,
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

export function selectInstrument(instrument: InstrumentType) {
  const config = tuningConfigs[instrument];
  useStore.setState({
    selectedInstrument: instrument,
    targetNote: config.notes[0],
    targetFrequency: config.frequencies[0],
  });
}

export function selectTargetNote(noteIndex: number) {
  const { selectedInstrument } = useStore.getState();
  const config = tuningConfigs[selectedInstrument];
  useStore.setState({
    targetNote: config.notes[noteIndex],
    targetFrequency: config.frequencies[noteIndex],
  });
}

// Tone generator functions
export function setToneNote(note: string) {
  useStore.setState({ selectedNote: note });
}

export function setToneOctave(octave: number) {
  useStore.setState({ selectedOctave: octave });
}

export function setToneVolume(volume: number) {
  useStore.setState({ volume });
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
    selectedInstrument: state.selectedInstrument,
    targetNote: state.targetNote,
    targetFrequency: state.targetFrequency,
  }));
}

export function useToneGeneratorState() {
  return useStore((state) => ({
    selectedNote: state.selectedNote,
    selectedOctave: state.selectedOctave,
    volume: state.volume,
    isPlaying: state.isPlaying,
  }));
} 