import { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box } from '@mui/material';
import { TabNavigation } from './components/navigation/TabNavigation';
import { MainContent } from './components/navigation/MainContent';
import { useTunerState, stopListening } from './components/tuner/tunerStore';
import { stopToneGeneration } from './components/toneGenerator/toneGeneratorStore';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#81C784', // Lighter subtle green for tuner
      dark: '#66BB6A', // Darker variant for hover states
    },
    secondary: {
      main: '#37b9dc', // Updated cyan for tone generator
      dark: '#2FA0C4', // Darker variant for hover states
    },
    background: {
      default: '#0D0D15', // Deep black-blue background
      paper: '#1A1A2A', // Black overlay for buttons/cards
    },
    text: {
      primary: '#ECECEC', // White for main text
      secondary: '#999CA5', // Subdued gray for secondary text
      disabled: '#999CA5',
    },
    divider: '#282A38', // Divider/line color
    action: {
      hover: '#282A38',
      selected: '#292d34', // Gray for selections
    },
    grey: {
      800: '#292d34', // Custom gray for tone selections
      700: '#323741', // Lighter gray for hover states
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
});

export function App() {
  const [tabValue, setTabValue] = useState(0);
  const { isListening } = useTunerState();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Stop both tuning and tone generation when switching tabs
    if (isListening) {
      stopListening();
    }
    stopToneGeneration();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          py: 2 
        }}>
          <TabNavigation tabValue={tabValue} onTabChange={handleTabChange} />
          <MainContent tabValue={tabValue} />
        </Box>
      </Container>
    </ThemeProvider>
  );
} 