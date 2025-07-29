import { create } from 'zustand';

type ToneGeneratorState = {
  selectedNote: string;
  selectedOctave: number;
  isPlaying: boolean;
};

const useToneGeneratorStore = create<ToneGeneratorState>(() => ({
  selectedNote: 'A',
  selectedOctave: 4,
  isPlaying: false,
}));

export function setToneNote(note: string) {
  useToneGeneratorStore.setState({ selectedNote: note });
}

export function setToneOctave(octave: number) {
  useToneGeneratorStore.setState({ selectedOctave: octave });
}

export function setTonePlaying(isPlaying: boolean) {
  useToneGeneratorStore.setState({ isPlaying });
}

export function stopToneGeneration() {
  useToneGeneratorStore.setState({ isPlaying: false });
}

export function useToneGeneratorState() {
  return useToneGeneratorStore((state) => ({
    selectedNote: state.selectedNote,
    selectedOctave: state.selectedOctave,
    isPlaying: state.isPlaying,
  }));
} 