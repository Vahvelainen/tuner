import { useEffect, useRef } from 'react';
import { 
  Box, 
  IconButton, 
  ToggleButton, 
  ToggleButtonGroup, 
  Typography,
  useTheme
} from '@mui/material';
import { PlayArrow, Stop } from '@mui/icons-material';
import { ToneGenerator as ToneGeneratorClass, frequencyFromNote } from '../../utils/audioProcessor';
import { 
  useToneGeneratorState, 
  setToneNote, 
  setToneOctave, 
  setTonePlaying 
} from '../../store/tunerStore';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

interface NoteDialProps {
  selectedNote: string;
  selectedOctave: number;
  onNoteChange: (note: string) => void;
}

function NoteDial({ selectedNote, selectedOctave, onNoteChange }: NoteDialProps) {
  const theme = useTheme();
  const radius = 160;
  const innerRadius = 110;
  const centerX = 200;
  const centerY = 200;

  const createSlicePath = (index: number) => {
    const anglePerSlice = 360 / NOTES.length;
    const startAngle = (index * anglePerSlice - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * anglePerSlice - 90) * (Math.PI / 180);

    const x1 = centerX + innerRadius * Math.cos(startAngle);
    const y1 = centerY + innerRadius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(startAngle);
    const y2 = centerY + radius * Math.sin(startAngle);
    const x3 = centerX + radius * Math.cos(endAngle);
    const y3 = centerY + radius * Math.sin(endAngle);
    const x4 = centerX + innerRadius * Math.cos(endAngle);
    const y4 = centerY + innerRadius * Math.sin(endAngle);

    const largeArcFlag = anglePerSlice > 180 ? 1 : 0;

    return `M ${x1} ${y1} 
            L ${x2} ${y2} 
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x3} ${y3}
            L ${x4} ${y4}
            A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1} Z`;
  };

  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mb: 0 }}>
      <svg width="400" height="400" style={{ cursor: 'pointer' }}>
        {NOTES.map((note, index) => {
          const isSelected = note === selectedNote;
          
          return (
            <g key={note}>
              <path
                d={createSlicePath(index)}
                fill={isSelected ? theme.palette.secondary.main : theme.palette.grey[800]}
                stroke={theme.palette.background.default}
                strokeWidth="3"
                style={{
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => onNoteChange(note)}
              />
              
              <text
                x={centerX + (innerRadius + (radius - innerRadius) / 2) * Math.cos((index * 30 - 90 + 15) * (Math.PI / 180))}
                y={centerY + (innerRadius + (radius - innerRadius) / 2) * Math.sin((index * 30 - 90 + 15) * (Math.PI / 180))}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isSelected ? theme.palette.text.primary : theme.palette.text.secondary}
                fontSize="16"
                fontWeight={isSelected ? 'bold' : 'normal'}
                style={{ 
                  pointerEvents: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {note}
              </text>
            </g>
          );
        })}
        
        {/* Center circle background */}
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius - 4}
          fill={theme.palette.background.default}
          stroke={theme.palette.divider}
          strokeWidth="2"
        />
      </svg>
      
      {/* Large note + frequency display in center */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            color: 'secondary.main',
            lineHeight: 1,
            mb: 1,
          }}
        >
          {selectedNote}{selectedOctave}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'text.secondary',
          }}
        >
          {frequencyFromNote(selectedNote, selectedOctave).toFixed(1)} Hz
        </Typography>
      </Box>
    </Box>
  );
}

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