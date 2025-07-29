import { Box } from '@mui/material';
import { TabPanel } from './TabPanel';
import { Tuner } from '../tuner/Tuner';
import { ToneGenerator } from '../toneGenerator/ToneGenerator';

interface Props {
  tabValue: number;
}

export function MainContent({ tabValue }: Props) {
  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 500, 
      mx: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Box sx={{ pt: 8, width: '100%', maxWidth: 500 }}>
        <TabPanel value={tabValue} index={0}>
          <Tuner />
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