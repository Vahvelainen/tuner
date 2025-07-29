import { Button } from '@mui/material';
import { PlayArrow, Stop } from '@mui/icons-material';
import { useTunerState } from './tunerStore';

interface Props {
  onStart: () => void;
  onStop: () => void;
}

export function TunerControls({ onStart, onStop }: Props) {
  const { isListening } = useTunerState();

  return (
    <Button
      variant="contained"
      size="large"
      onClick={isListening ? onStop : onStart}
      startIcon={isListening ? <Stop /> : <PlayArrow />}
      sx={{ 
        py: 2, 
        fontSize: '1.2rem',
        minWidth: 200,
        backgroundColor: 'primary.main',
        color: 'background.default',
        '&:hover': {
          backgroundColor: 'primary.dark',
        }
      }}
    >
      {isListening ? 'Stop Tuning' : 'Start Tuning'}
    </Button>
  );
} 