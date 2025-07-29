import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Alert } from '@mui/material';
import { TunerDisplay } from './TunerDisplay';
import { TunerControls } from './TunerControls';
import { AudioProcessor, noteFromFrequency } from './audioProcessor';
import { useTunerState, updateFrequency, startListening, stopListening } from './tunerStore';

export function Tuner() {
  const [error, setError] = useState<string>('');
  const audioProcessorRef = useRef<AudioProcessor | null>(null);
  const { isListening } = useTunerState();

  useEffect(() => {
    audioProcessorRef.current = new AudioProcessor();
    
    return () => {
      if (audioProcessorRef.current) {
        audioProcessorRef.current.destroy();
      }
    };
  }, []);

  const initializeAudio = async () => {
    try {
      if (audioProcessorRef.current) {
        await audioProcessorRef.current.initialize();
        setError('');
        return true;
      }
    } catch (err) {
      setError('Microphone access is required for the tuner to work');
      return false;
    }
    return false;
  };

  const startTuning = async () => {
    const initialized = await initializeAudio();
    if (initialized) {
      startListening();
      processAudio();
    }
  };

  const stopTuning = () => {
    stopListening();
  };

  const processAudio = useCallback(() => {
    if (!audioProcessorRef.current) return;

    const frequency = audioProcessorRef.current.getFrequency();
    const { note, centsOff } = noteFromFrequency(frequency);
    
    updateFrequency(frequency, note, centsOff);
  }, []);

  useEffect(() => {
    let frameId: number;
    
    const animate = () => {
      if (isListening) {
        processAudio();
        frameId = requestAnimationFrame(animate);
      }
    };

    if (isListening) {
      animate();
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isListening, processAudio]);

  return (
    <Box sx={{ 
      gap: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pt: 2
    }}>
      <TunerDisplay />
      
      <TunerControls 
        onStart={startTuning}
        onStop={stopTuning}
      />
      
      {error && (
        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
          {error}
        </Alert>
      )}
    </Box>
  );
} 