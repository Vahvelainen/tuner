import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useTunerState, selectInstrument, type InstrumentType } from '../../store/tunerStore';

export function InstrumentSelector() {
  const { selectedInstrument } = useTunerState();

  const handleInstrumentChange = (
    _event: React.MouseEvent<HTMLElement>,
    newInstrument: InstrumentType | null,
  ) => {
    if (newInstrument !== null) {
      selectInstrument(newInstrument);
    }
  };

  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Instrument
      </Typography>
      <ToggleButtonGroup
        value={selectedInstrument}
        exclusive
        onChange={handleInstrumentChange}
        sx={{ width: '100%' }}
      >
        <ToggleButton value="guitar" sx={{ flex: 1 }}>
          Guitar
        </ToggleButton>
        <ToggleButton value="violin" sx={{ flex: 1 }}>
          Violin
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
} 