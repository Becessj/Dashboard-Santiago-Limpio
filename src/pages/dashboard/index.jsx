// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React, { useState, useEffect } from 'react';
// project import
import MainCard from 'components/MainCard';
import RoutesStatistics from 'components/cards/statistics/RoutesStatistics';
import NotificacionesStatistics from 'components/cards/statistics/NotificacionesStatistics';
import UsuarioStatistics from 'components/cards/statistics/UsuarioStatistics';

import NoticiasStatistics from 'components/cards/statistics/NoticiasStatistics';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from './MonthlyBarChart';
import ReportAreaChart from './ReportAreaChart';
import UniqueVisitorCard from './UniqueVisitorCard';
import SaleReportCard from './SaleReportCard';
import OrdersTable from './OrdersTable';
import CustomCard from './CustomCard';

// assets
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

import img1 from 'assets/images/1.png';
import img2 from 'assets/images/2.png';
import img3 from 'assets/images/3.png';
import img4 from 'assets/images/4.png';
// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};



// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function Dashboard() {
  const [routesCount, setRoutesCount] = useState(0);
  const [totalperceCount, setTotalperce] = useState(0);
  const getRoute = async (start, end) => {
    const API_KEY = "pk.eyJ1IjoidGljZ3BhIiwiYSI6ImNtM2phb2s3ZzAxZ2Yyam9vN2g2dWZqYmkifQ.F06jOTPnX6ba8h-aImqKVw";
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
  
    if (data.routes.length) {
      const { duration, distance, geometry } = data.routes[0];
      return { duration, distance, geometry }; // Tiempo en segundos, distancia en metros, ruta GeoJSON.
    }
    throw new Error("No se encontró ruta.");
  };
  
  // Uso
  getRoute([-122.42, 37.78], [-122.45, 37.91])
    .then(route => console.log(route))
    .catch(err => console.error(err));
  

  useEffect(() => {
    const fetchRoutesCount = async () => {

        try {
            const response = await fetch("http://localhost:3001/api/countroutes");
            if (!response.ok) {
                throw new Error('Failed to fetch routes count');
            }
            const data = await response.json();
            setRoutesCount(data.count ?? null);
        } catch (err) {
            console.error('Error fetching routes count:', err);
        }
    };
    const fetchTotalPercentage = async () => {

      try {
          const response = await fetch("http://localhost:3001/api/total");
          if (!response.ok) {
              throw new Error('Failed to fetch routes count');
          }
          const data = await response.json();
          setTotalperce(data.completion_percentage ?? null);
      } catch (err) {
          console.error('Error fetching routes count:', err);
      }
  };

    fetchRoutesCount();
    fetchTotalPercentage();
}, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
    {/* row 1 */}
    <Grid item xs={12} sx={{ mb: -2.25 }}>
      <Typography variant="h5"></Typography>
    </Grid>
    <Grid item xs={12} sm={6} md={4} lg={30}>
  <CustomCard />
</Grid>

    <Grid item xs={12} id="statistics-section" sm={6} md={4} lg={3}>
        <RoutesStatistics  title="Rutas" percentage={totalperceCount} isLoss={false} extra="extra" imageUrl={img1}/>
    </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <NotificacionesStatistics title="Notificaciones" count="5"  extra="8,900" imageUrl={img2} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <NoticiasStatistics title="Noticias" count="3" isLoss color="warning" extra="1,943" imageUrl={img3}  />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <UsuarioStatistics title="Usuarios" count="3" isLoss color="warning" extra="1,943" imageUrl={img4}  />
      </Grid>
      {/* <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Usuarios" count="1" isLoss color="warning" extra="$20,395" />
      </Grid> */}

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xl={16} md={7} lg={8}>
        <UniqueVisitorCard />
      </Grid>
        

      {/* row 3 */}
      {/* <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Orders</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid> */}
      {/* <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Analytics Report</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary="Company Finance Growth" />
              <Typography variant="h5">+45.14%</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="Company Expenses Ratio" />
              <Typography variant="h5">0.58%</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Business Risk Cases" />
              <Typography variant="h5">Low</Typography>
            </ListItemButton>
          </List>
          <ReportAreaChart />
        </MainCard>
      </Grid> */}

      {/* row 4 */}
      {/* <Grid item xs={12} md={7} lg={8}>
        <SaleReportCard />
      </Grid> */}
      {/* <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Transaction History</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List
            component="nav"
            sx={{
              px: 0,
              py: 0,
              '& .MuiListItemButton-root': {
                py: 1.5,
                '& .MuiAvatar-root': avatarSX,
                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
              }
            }}
          >
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                  <GiftOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #002434</Typography>} secondary="Today, 2:00 AM" />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $1,430
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    78%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                  <MessageOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #984947</Typography>} secondary="5 August, 1:45 PM" />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $302
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    8%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                  <SettingOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #988784</Typography>} secondary="7 hours ago" />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $682
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    16%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
          </List>
        </MainCard>
        <MainCard sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Stack>
                  <Typography variant="h5" noWrap>
                    Help & Support Chat
                  </Typography>
                  <Typography variant="caption" color="secondary" noWrap>
                    Typical replay within 5 min
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>
                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  <Avatar alt="Remy Sharp" src={avatar1} />
                  <Avatar alt="Travis Howard" src={avatar2} />
                  <Avatar alt="Cindy Baker" src={avatar3} />
                  <Avatar alt="Agnes Walker" src={avatar4} />
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
              Need Help?
            </Button>
          </Stack>
        </MainCard>
      </Grid> */}
      <Grid item xs={12} md={5} lg={4}>
      <MainCard sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Stack>
                  <Typography variant="h5" noWrap>
                    Ayuda & Soporte Chat
                  </Typography>
                  <Typography variant="caption" color="secondary" noWrap>
                   Respuesta aproximada de 5 minutos
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>
                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  <Avatar alt="Remy Sharp" src={avatar1} />
                  <Avatar alt="Travis Howard" src={avatar2} />
                  <Avatar alt="Cindy Baker" src={avatar3} />
                  <Avatar alt="Agnes Walker" src={avatar4} />
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
            ¿Necesitas ayuda?
            </Button>
          </Stack>
        </MainCard>
        </Grid>
    </Grid>
  );
}
