import { Box, Typography, useTheme } from '@mui/material';
import { frequencyFromNote } from './audioProcessor';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

interface Props {
  selectedNote: string;
  selectedOctave: number;
  onNoteChange: (note: string) => void;
}

export function NoteDial({ selectedNote, selectedOctave, onNoteChange }: Props) {
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
        
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius - 4}
          fill={theme.palette.background.default}
          stroke={theme.palette.divider}
          strokeWidth="2"
        />
      </svg>
      
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