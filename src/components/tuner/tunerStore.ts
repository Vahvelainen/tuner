import { create } from 'zustand';

type TunerState = {
  isListening: boolean;
  currentFrequency: number;
  detectedNote: string;
  centsOff: number;
};

const useTunerStore = create<TunerState>(() => ({
  isListening: false,
  currentFrequency: 0,
  detectedNote: '',
  centsOff: 0,
}));

export function startListening() {
  useTunerStore.setState({ isListening: true });
}

export function stopListening() {
  useTunerStore.setState({ isListening: false });
}

export function updateFrequency(frequency: number, note: string, centsOff: number) {
  useTunerStore.setState({
    currentFrequency: frequency,
    detectedNote: note,
    centsOff: centsOff,
  });
}

export function useTunerState() {
  return useTunerStore((state) => ({
    isListening: state.isListening,
    currentFrequency: state.currentFrequency,
    detectedNote: state.detectedNote,
    centsOff: state.centsOff,
  }));
} 