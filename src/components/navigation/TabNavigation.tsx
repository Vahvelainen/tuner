import { Box, Tabs, Tab } from '@mui/material';
import { a11yProps } from './TabPanel';

interface Props {
  tabValue: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export function TabNavigation({ tabValue, onTabChange }: Props) {
  return (
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
          onChange={onTabChange} 
          aria-label="tuner tabs"
          sx={{
            '& .MuiTab-root': {
              fontSize: '1.1rem',
              fontWeight: 500,
              minWidth: 120,
              px: 3,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: tabValue === 0 ? 'primary.main' : 'secondary.main',
              }
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '2px 2px 0 0',
              backgroundColor: tabValue === 0 ? 'primary.main' : 'secondary.main',
            }
          }}
        >
          <Tab label="Tuner" {...a11yProps(0)} />
          <Tab label="Tone Generator" {...a11yProps(1)} />
        </Tabs>
      </Box>
    </Box>
  );
} 