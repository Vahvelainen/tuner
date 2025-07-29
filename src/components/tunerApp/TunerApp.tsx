import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Alert, Tabs, Tab } from '@mui/material';
import { TunerDisplay } from '../tunerDisplay/TunerDisplay';
import { TunerControls } from '../tunerControls/TunerControls';
import { ToneGenerator } from '../toneGenerator/ToneGenerator';
import { AudioProcessor, noteFromFrequency } from '../../utils/audioProcessor';
import { useTunerState, updateFrequency, startListening, stopListening, stopToneGeneration } from '../../store/tunerStore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export function TunerApp() {
  const [error, setError] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);
  const audioProcessorRef = useRef<AudioProcessor | null>(null);
  const { isListening } = useTunerState();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Stop both tuning and tone generation when switching tabs
    if (isListening) {
      stopListening();
    }
    stopToneGeneration();
  };

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
      width: '100%', 
      maxWidth: 500, 
      mx: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        pt: 2
      }}>
        <Box sx={{ 
          display: 'inline-block',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="tuner tabs"
            sx={{
              '& .MuiTab-root': {
                fontSize: '1.1rem',
                fontWeight: 500,
                minWidth: 120,
                px: 3,
                color: 'text.secondary', // Subdued gray for inactive
                '&.Mui-selected': {
                  color: tabValue === 0 ? 'primary.main' : 'secondary.main', // Purple for tuner, cyan for tone generator
                }
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '2px 2px 0 0',
                backgroundColor: tabValue === 0 ? 'primary.main' : 'secondary.main', // Purple for tuner, cyan for tone generator
              }
            }}
          >
            <Tab label="Tuner" {...a11yProps(0)} />
            <Tab label="Tone Generator" {...a11yProps(1)} />
          </Tabs>
        </Box>
      </Box>
      
      {/* Content area with top padding to account for fixed tabs */}
      <Box sx={{ pt: 8, width: '100%', maxWidth: 500 }}>
        <TabPanel value={tabValue} index={0}>
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
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ 
            gap: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 1
          }}>
            <ToneGenerator />
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
} 