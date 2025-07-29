import { Box, Typography, LinearProgress } from '@mui/material';
import { useTunerState } from './tunerStore';
import { useState, useEffect } from 'react';

export function TunerDisplay() {
  const { detectedNote, centsOff, currentFrequency, isListening } = useTunerState();
  const [lastDetectedNote, setLastDetectedNote] = useState<string>('C');

  // Update last detected note when we detect a new one
  useEffect(() => {
    if (detectedNote) {
      setLastDetectedNote(detectedNote);
    }
  }, [detectedNote]);

  // All 12 notes in chromatic order
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  const getDialRotation = () => {
    // Use last detected note if no current note, otherwise use current note
    const noteToShow = detectedNote || lastDetectedNote;
    
    // Find the index of the note to show
    const noteIndex = notes.indexOf(noteToShow);
    if (noteIndex === -1) return 0;
    
    // Calculate base rotation to center the note at top
    const baseRotation = -(noteIndex * 30); // 360/12 = 30 degrees per note
    
    // Add fine adjustment based on cents - FIXED DIRECTION
    // When sharp (+centsOff), we want to show movement towards higher note
    // When flat (-centsOff), we want to show movement towards lower note
    // Since dial rotates opposite to note movement, we need negative sign
    const centsAdjustment = detectedNote ? -(centsOff / 50) * 15 : 0;
    
    return baseRotation + centsAdjustment;
  };

  const getProgressValue = () => {
    // Map cents (-50 to +50) to progress (0 to 100)
    return Math.max(0, Math.min(100, (centsOff + 50)));
  };

  const getProgressColor = () => {
    const absOff = Math.abs(centsOff);
    if (absOff < 5) return 'success';
    if (absOff < 15) return 'warning';
    return 'error';
  };

  const getTuningStatus = () => {
    const absOff = Math.abs(centsOff);
    if (!isListening || !detectedNote) return 'Ready to tune';
    if (absOff < 5) return 'In tune!';
    if (centsOff > 0) return 'Too sharp';
    return 'Too flat';
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 500, 
      textAlign: 'center',
      mx: 'auto',
      pt: 3
    }}>
      {/* Dial Container - small window reveals big dial */}
      <Box sx={{ 
        position: 'relative', 
        width: { xs: 'min(90vw, 450px)', sm: 450 }, // Responsive but capped width
        height: 150,
        mx: 'auto',
        mb: 3,
        overflow: 'hidden', // This creates the small window
        borderRadius: '12px', // Slightly larger radius
      }}>
        {/* Large circular dial that rotates */}
        <Box sx={{
          position: 'absolute',
          width: 700, // Fixed size to match note calculations
          height: 700,
          left: '50%',
          top: 12.5,
          transform: `translateX(-50%) rotate(${getDialRotation()}deg)`,
          transition: 'transform 0.4s ease-out',
          transformOrigin: '350px 350px' // Fixed center point to match calculations
        }}>
          {/* Outer circle */}
          <Box sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '4px solid', // Slightly thicker
            borderColor: 'divider'
          }} />
          
          {/* Tick marks for each note */}
          {notes.map((_, index) => {
            const angle = index * 30; // 30 degrees per note
            const tickRadius = 340; // Base radius
            const tickLength = 25; // Base tick length
            const x1 = 350 + tickRadius * Math.cos((angle - 90) * Math.PI / 180);
            const y1 = 350 + tickRadius * Math.sin((angle - 90) * Math.PI / 180);
            
            return (
              <Box
                key={`tick-${index}`}
                sx={{
                  position: 'absolute',
                  left: x1,
                  top: y1,
                  width: 3,
                  height: tickLength,
                  backgroundColor: 'text.secondary',
                  transformOrigin: '1.5px 0px',
                  transform: `rotate(${angle}deg) translateY(-${tickLength}px)`
                }}
              />
            );
          })}
          
          {/* Note labels around the circle */}
          {notes.map((note, index) => {
            const angle = index * 30 - 90; // Start from top
            const radius = 280; // Base radius
            const x = 350 + radius * Math.cos(angle * Math.PI / 180);
            const y = 350 + radius * Math.sin(angle * Math.PI / 180);
            const textRotation = angle + 90; // Rotate text to be readable
            
            return (
              <Typography
                key={note}
                variant="h4"
                sx={{
                  position: 'absolute',
                  left: x - 20,
                  top: y - 20,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'normal',
                  color: 'text.primary',
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  transform: `rotate(${textRotation}deg)`,
                  transformOrigin: '50% 50%'
                }}
              >
                {note}
              </Typography>
            );
          })}
        </Box>
        
        {/* Fixed center indicator line */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 4, // Slightly thicker
          height: '100%',
          backgroundColor: 'primary.main',
          zIndex: 1
        }} />
      </Box>

      {/* Progress bar for tuning accuracy - always visible to prevent jumping */}
      <Box sx={{ mb: 2, px: 3, minHeight: '2.5rem' }}>
        <LinearProgress
          variant="determinate"
          value={isListening && detectedNote ? getProgressValue() : 50}
          color={isListening && detectedNote ? getProgressColor() : 'primary'}
          sx={{ 
            height: 10, // Slightly taller
            borderRadius: 5,
            mb: 1,
            opacity: isListening && detectedNote ? 1 : 0.3,
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
            }
          }}
        />
        <Typography 
          variant="body2" 
          color="textSecondary"
          sx={{ minHeight: '1rem' }}
        >
          {isListening && detectedNote ? (
            `${centsOff > 0 ? '+' : ''}${centsOff} cents`
          ) : (
            ' '
          )}
        </Typography>
      </Box>

      {/* Content area with fixed heights to prevent bouncing */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h3" // Larger detected note
          sx={{ 
            fontWeight: 'bold',
            color: detectedNote ? 'text.primary' : 'text.disabled',
            mb: 1,
            minHeight: '3rem', // Larger reserve space
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {detectedNote || lastDetectedNote}
        </Typography>
        
        <Typography 
          variant="h6" // Larger status text
          sx={{ 
            mb: 1,
            minHeight: '2rem', // Larger reserve space
            color: isListening && detectedNote ? (
              Math.abs(centsOff) < 5 ? 'success.main' : 
              Math.abs(centsOff) < 15 ? 'warning.main' : 'error.main'
            ) : 'text.secondary',
            fontWeight: 500
          }}
        >
          {getTuningStatus()}
        </Typography>
        
        <Typography 
          variant="body1" // Larger frequency text
          color="textSecondary"
          sx={{ 
            minHeight: '1.5rem' // Reserve space
          }}
        >
          {currentFrequency > 0 ? (
            `${currentFrequency.toFixed(1)} Hz`
          ) : (
            ' ' // Empty space to maintain height
          )}
        </Typography>
      </Box>
    </Box>
  );
} 