// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import NotificationsTable from '../notificaciones/NotificationsTable';
// project import
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Notificaciones() {
  return (
        <MainCard sx={{ mt: 2 }} content={false}>
            <NotificationsTable />
        </MainCard>


  );
}
