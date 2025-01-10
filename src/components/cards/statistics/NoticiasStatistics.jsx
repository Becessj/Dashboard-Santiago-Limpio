import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// material-ui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';
import React, { useState, useEffect } from 'react';
// assets
import RiseOutlined from '@ant-design/icons/RiseOutlined';
import FallOutlined from '@ant-design/icons/FallOutlined';

const iconSX = { fontSize: '0.75rem', color: 'inherit', marginLeft: 0, marginRight: 0 };

export default function NoticiasStatistics({ color = 'primary', title, count, percentage, isLoss, extra , imageUrl}) {
   
  const [newsCount, setNewsCount] = useState(0);
 

  useEffect(() => {
    const fetchNewsCount = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/countnews");
            if (!response.ok) {
                throw new Error('Failed to fetch routes count');
            }
            const data = await response.json();
            setNewsCount(data.count ?? null);
        } catch (err) {
            console.error('Error fetching routes count:', err);
        }
    };

    fetchNewsCount();
}, []);

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/noticias');
  };

  return (
    <MainCard contentSX={{ p: 2.25 }} onClick={handleNavigate} sx={{ cursor: 'pointer' }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h3" color="inherit">
              {String(newsCount || 0)}
            </Typography>
          </Grid>
          {percentage && (
            <Grid item>
              <Chip
                variant="combined"
                color={color}
                icon={isLoss ? <FallOutlined style={iconSX} /> : <RiseOutlined style={iconSX} />}
                label={`${percentage}%`}
                sx={{ ml: 1.25, pl: 1 }}
                size="small"
              />
            </Grid>
          )}
          {/* Agregar la imagen al lado derecho */}
          {imageUrl && (
            <Grid item>
              <img src={imageUrl} alt="Imagen de ejemplo" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }} />
            </Grid>
          )}
        </Grid>
      </Stack>
      
    </MainCard>
  );
}

NoticiasStatistics.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.string,
  imageUrl: PropTypes.string // Propiedad opcional para la imagen
};
