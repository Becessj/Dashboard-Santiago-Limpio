import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';
import IncomeAreaChart from './IncomeAreaChart';

// ==============================|| DEFAULT - UNIQUE VISITOR ||============================== //

export default function UniqueVisitorCard() {
  const [slot, setSlot] = useState('Semanal');

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Visitas de la aplicación</Typography>
        </Grid>
        <Grid item>
          <Stack direction="row" alignItems="center" spacing={0}>
            <Button
              size="small"
              onClick={() => setSlot('Mensual')}
              color={slot === 'Mensual' ? 'primary' : 'secondary'}
              variant={slot === 'Mensual' ? 'outlined' : 'text'}
            >
              Mensual
            </Button>
            <Button
              size="small"
              onClick={() => setSlot('Semanal')}
              color={slot === 'Semanal' ? 'primary' : 'secondary'}
              variant={slot === 'Semanal' ? 'outlined' : 'text'}
            >
              Semanal
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart slot={slot} />
        </Box>
      </MainCard>
    </>
  );
}
