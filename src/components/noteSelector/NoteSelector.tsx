import { ButtonGroup, Button, Typography } from '@mui/material';
import { useTunerState, selectTargetNote, tuningConfigs } from '../../store/tunerStore';

export function NoteSelector() {
  const { selectedInstrument, targetNote } = useTunerState();
  const config = tuningConfigs[selectedInstrument];

  const handleNoteSelect = (noteIndex: number) => {
    selectTargetNote(noteIndex);
  };

  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Target Note
      </Typography>
      <ButtonGroup variant="outlined" sx={{ width: '100%', flexWrap: 'wrap' }}>
        {config.notes.map((note, index) => (
          <Button
            key={`${note}-${index}`}
            onClick={() => handleNoteSelect(index)}
            variant={note === targetNote ? 'contained' : 'outlined'}
            sx={{ 
              flex: 1, 
              minWidth: '50px',
              fontSize: '1.1rem',
              fontWeight: note === targetNote ? 'bold' : 'normal'
            }}
          >
            {note}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
} 