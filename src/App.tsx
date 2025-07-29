import { ThemeProvider, createTheme, CssBaseline, Container, Box } from '@mui/material';
import { TunerApp } from './components/tunerApp/TunerApp';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#ff5722',
    },
  },
});

export function App() {
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
          <TunerApp />
        </Box>
      </Container>
    </ThemeProvider>
  );
} 