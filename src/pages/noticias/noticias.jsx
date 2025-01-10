// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import NoticiasTable from './NoticiasTable';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Noticias() {
  return (
    <MainCard sx={{ mt: 2 }} content={false}>
    <NoticiasTable />
</MainCard>
  );
}
