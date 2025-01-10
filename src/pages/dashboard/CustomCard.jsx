import React from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-scroll'; // Importa Link desde react-scroll
import imagen1 from 'assets/images/users/parque.png';
const CustomCard = () => {
  // Estilos del contenedor principal con degradado
  const CardContainer = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(to right, #033aa4, #fff)', // Degradado de izquierda a derecha
    borderRadius: theme.spacing(2), // Bordes redondeados
    color: 'white', // Texto blanco
    padding: theme.spacing(4), // Espaciado interno
    display: 'flex',
    alignItems: 'center',
  }));

  // Botón estilizado
  const StyledButton = styled(Button)(({ theme }) => ({
    color: 'white', // Color del texto en blanco
    border: '1px solid white', // Borde blanco
    backgroundColor: 'transparent', // Fondo transparente
    width: 'fit-content', // Ancho ajustado al contenido
    textTransform: 'none', // Texto sin mayúsculas automáticas
    padding: theme.spacing(1, 3), // Espaciado interno del botón
    borderRadius: theme.spacing(1), // Bordes redondeados del botón
   
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fondo con transparencia al pasar el mouse
    },
  }));

  return (
    <CardContainer>
      <Grid container spacing={3}>
        {/* Columna izquierda: texto y botón */}
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Typography variant="h1" fontWeight="bold">
              Bienvenido a Santiago Limpio
            </Typography>
            <Typography variant="body1">
              "¡Con Santiago Limpio, sigamos la ruta hacia un distrito más limpio! 🚛♻️"
            </Typography>
            <Grid item xs={12} sx={{ textAlign: 'left', mt: 2 }}>
        <Link to="statistics-section" smooth={true} duration={500}>
          <StyledButton>Ver estadísticas completas</StyledButton>
        </Link>
      </Grid>
          </Stack>
        </Grid>

        {/* Columna derecha: imagen */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={imagen1}
            alt="Santiago Limpio"
            sx={{
              width: '100%', // Ajusta al ancho disponible
              maxWidth: 350, // Tamaño máximo de la imagen
              display: 'block',
              margin: '0 auto', // Centrado horizontal
            }}
          />
        </Grid>
      </Grid>
    </CardContainer>
  );
};

export default CustomCard;
