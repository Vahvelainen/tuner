import { useEffect, useRef } from 'react';
import { 
  Box, 
  IconButton, 
  ToggleButton, 
  ToggleButtonGroup, 
  Typography
} from '@mui/material';
import { PlayArrow, Stop } from '@mui/icons-material';
import { ToneGenerator as ToneGeneratorClass, frequencyFromNote } from './audioProcessor';
import { 
  useToneGeneratorState, 
  setToneNote, 
  setToneOctave, 
  setTonePlaying 
} from './toneGeneratorStore';
import { NoteDial } from './NoteDial';

export function ToneGenerator() {
  const { selectedNote, selectedOctave, isPlaying } = useToneGeneratorState();
  const toneGeneratorRef = useRef<ToneGeneratorClass | null>(null);

  useEffect(() => {
    const initToneGenerator = async () => {
      toneGeneratorRef.current = new ToneGeneratorClass();
      await toneGeneratorRef.current.initialize();
      toneGeneratorRef.current.setVolume(1.0); // Fixed 100% volume
    };

    initToneGenerator();

    return () => {
      if (toneGeneratorRef.current) {
        toneGeneratorRef.current.destroy();
      }
    };
  }, []);

  // Stop audio when isPlaying becomes false (e.g., when tab changes)
  useEffect(() => {
    if (!isPlaying && toneGeneratorRef.current) {
      toneGeneratorRef.current.stop();
    }
  }, [isPlaying]);

  const handleNoteChange = (note: string) => {
    setToneNote(note);
    if (isPlaying && toneGeneratorRef.current) {
      const frequency = frequencyFromNote(note, selectedOctave);
      toneGeneratorRef.current.play(frequency);
    }
  };

  const handleOctaveChange = (_event: React.MouseEvent<HTMLElement>, newOctave: number | null) => {
    if (newOctave !== null) {
      setToneOctave(newOctave);
      if (isPlaying && toneGeneratorRef.current) {
        const frequency = frequencyFromNote(selectedNote, newOctave);
        toneGeneratorRef.current.play(frequency);
      }
    }
  };

  const handlePlayStop = () => {
    if (!toneGeneratorRef.current) return;

    if (isPlaying) {
      toneGeneratorRef.current.stop();
      setTonePlaying(false);
    } else {
      const frequency = frequencyFromNote(selectedNote, selectedOctave);
      toneGeneratorRef.current.play(frequency);
      setTonePlaying(true);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: 1.5,
      width: '100%',
      maxWidth: 500,
      mx: 'auto'
    }}>
      {/* Note Dial with integrated display */}
      <NoteDial 
        selectedNote={selectedNote} 
        selectedOctave={selectedOctave}
        onNoteChange={handleNoteChange} 
      />

      {/* Octave Toggle - Very small margin from dial */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: -2.5 }}>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          Octave
        </Typography>
        <ToggleButtonGroup
          value={selectedOctave}
          exclusive
          onChange={handleOctaveChange}
          size="large"
          sx={{
            '& .MuiToggleButton-root': {
              fontSize: '1.2rem',
              fontWeight: 'bold',
              minWidth: 50,
              minHeight: 50,
              color: 'text.secondary',
              border: '1px solid',
              borderColor: 'divider',
              '&.Mui-selected': {
                backgroundColor: 'grey.800',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'grey.700',
                }
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }
          }}
        >
          {[2, 3, 4, 5, 6].map((octave) => (
            <ToggleButton key={octave} value={octave}>
              {octave}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* Play/Stop Button */}
      <IconButton
        onClick={handlePlayStop}
        size="large"
        sx={{
          width: 100,
          height: 100,
          bgcolor: isPlaying ? 'error.main' : 'secondary.main',
          color: isPlaying ? 'white' : 'background.default',
          mt: 3, // Added more margin from octave selection
          '&:hover': {
            bgcolor: isPlaying ? 'error.dark' : 'secondary.dark',
          },
        }}
      >
        {isPlaying ? <Stop sx={{ fontSize: 50 }} /> : <PlayArrow sx={{ fontSize: 50 }} />}
      </IconButton>
    </Box>
  );
} 