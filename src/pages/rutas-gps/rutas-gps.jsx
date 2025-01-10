import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';
import DaySelector from './DaySelector'
import CompactadorSelector from './CompactadorSelector'
import HorarioSelector from './HorarioSelector'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, CardMedia,Pagination 
} from '@mui/material';
import { borderRadius } from '@mui/system';
export default function RutasGPS() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  useEffect(() => {
    // Fetching data from API
    const fetchRoutes = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/routes');
        const data = await response.json();
        setRoutes(data);
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);
  useEffect(() => {
    if (openModal) {
      const timer = setTimeout(() => {
        handleCloseModal();
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [openModal]);
  if (loading) {
    return (
      <Box
        sx={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Rutas GPS
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  const uniqueRoutes = [];
  const seenIds = new Set();

  routes.forEach(route => {
    route.features.forEach(feature => {
      if (!seenIds.has(feature.properties.id)) {
        uniqueRoutes.push(feature);
        seenIds.add(feature.properties.id);
      }
    });
  });

  const handleOpenModal = async (route) => {
    setSelectedRoute(route);
    setOpenModal(true);
  
    try {
      const response = await fetch(`http://localhost:3001/api/routes/${route.properties.id}`);
      const data = await response.json();
      
      console.log(data.features);
  
      // Verificar si 'features' existe y contiene datos
      if (data.features && data.features.length > 0) {
        console.log("Procesando las coordenadas...");
  
        // Extraer y respetar cada set de coordenadas por 'features'
        const coordinatesByFeature = data.features.map(feature => {
          if (
            feature.geometry &&
            feature.geometry.coordinates &&
            feature.geometry.type === "MultiLineString"
          ) {
            return feature.geometry.coordinates.map(line =>
              line.map(coord => ({ lat: coord[1], lng: coord[0] }))
            );
          }
          return [];
        });
  
        console.log("Coordenadas procesadas por features:", coordinatesByFeature);
  
        // Actualizar `selectedRoute` respetando las coordenadas separadas por features
        setSelectedRoute({
          ...route,
          geometry: {
            type: "MultiLineString",
            coordinates: coordinatesByFeature, // Lista separada por feature
          },
        });
      } else {
        console.error("No se encontraron features para esta ruta.");
      }
    } catch (error) {
      console.error("Error fetching route details:", error);
    }
  };
  

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRoute(null);
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calcular los elementos de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = uniqueRoutes.slice(indexOfFirstItem, indexOfLastItem);
  const handleSaveChanges = () => {
    setOpenConfirmDialog(true);
  };
  const confirmSaveChanges = async () => {
    setOpenConfirmDialog(false);
    try {
      // Extraer solo los campos necesarios
      const updatedRoute = {
        days: selectedRoute.properties.days,
        truck: selectedRoute.properties.truck,
        schedule_start: selectedRoute.properties.schedule_start,
        schedule_end: selectedRoute.properties.schedule_end,
      };
  
      const response = await fetch(`http://localhost:3001/api/routes/${selectedRoute.properties.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRoute),
      });
  
      if (response.ok) {
   
  
        // Actualizar el estado local sin recargar
        setRoutes(prevRoutes => {
          return prevRoutes.map(route => {
            const updatedFeatures = route.features.map(feature => {
              if (feature.properties.id === selectedRoute.properties.id) {
                // Actualizamos solo la ruta modificada
                return {
                  ...feature,
                  properties: {
                    ...feature.properties,
                    days: updatedRoute.days,
                    truck: updatedRoute.truck,
                    schedule_start: updatedRoute.schedule_start,
                    schedule_end: updatedRoute.schedule_end,
                  },
                };
              }
              return feature;
            });
            return { ...route, features: updatedFeatures };
          });
        });
      } else {
        alert('Error al actualizar la ruta.');
      }
    } catch (error) {
      console.error('Error al actualizar la ruta:', error);
      alert('Error al conectar con el servidor.');
    }
    setOpenModal(false);
  };
  
  
  return (
    <Box
      sx={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
    
    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
    {/* {uniqueRoutes.map((feature, index) => ( */}
            {currentItems.map((feature, index) => (
                <Card 
                    key={index} 
                    variant="outlined" 
                    onClick={() => handleOpenModal(feature)}
                    style={{
                        cursor: 'pointer', 
                        borderRadius: '8px', 
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                <b>{feature.properties.nombreruta}</b>
                            </Typography>
                            {/* <Typography><b>ID:</b> {feature.properties.id}</Typography> */}
                            <Typography><b>Días:</b> {feature.properties.days || "Sin información"}</Typography>
                            <Typography><b>Compactador:</b> {feature.properties.truck || "Sin información"}</Typography>
                            <Typography><b>Horario:</b> {feature.properties.schedule_start ? `${feature.properties.schedule_start} a ${feature.properties.schedule_end}` : "Sin información"}</Typography>
                        </Box>
                        {/* <CardMedia
                            component="img"
                            alt={feature.properties.nombreruta}
                            height="100"
                            image={feature.properties.imageUrl || 'default-image.jpg'} // Ajusta esta ruta de imagen según tu estructura
                            style={{ marginLeft: 'auto', width: '30%' }} // Ajusta el estilo de la imagen
                        /> */}
                        <CardMedia
                            component="img"
                            alt={feature.properties.nombreruta}
                            height="100"
                            image={
                                feature.properties.img_map 
                                ? `data:image/png;base64,${feature.properties.img_map}` 
                                : 'https://santiagolimpio.guamanpoma.org/uploads/mapa.png'
                            }
                            style={{ marginLeft: 'auto', width: '30%' , borderRadius: '8px'}} // Ajusta el estilo de la imagen
                        />

                    </CardContent>
                </Card>
            ))}
        </Box>
        {/* Paginación */}
        <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
              shape="rounded"
              
                count={Math.ceil(uniqueRoutes.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
      {/* Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="route-modal-title"
        aria-describedby="route-modal-description"
      >
        <Box sx={{ ...modalStyle }}>
          <Typography id="route-modal-title" variant="h6" component="h2">
           
           DETALLES DE LA RUTA
          </Typography>
          {selectedRoute ? (
            <Box>
              {/* <TextField
                label="ID"
                value={selectedRoute.properties.id}
                fullWidth
                margin="normal"
                disabled
              /> */}
              <TextField
                label="Nombre ruta"
                value={selectedRoute.properties.nombreruta}
                fullWidth
                margin="normal"
                disabled
              />
              <DaySelector selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} />
              <CompactadorSelector selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} />

              <HorarioSelector selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} />
              {/*DESCOMENTA ESTO PARA VISUALIZAR LA IMAGEN ENVIADA DESDE QGIS */}
              {/* <CardMedia  component="img"  image={
                                selectedRoute.properties.img_map 
                                ? `data:image/png;base64,${selectedRoute.properties.img_map}` 
                                : 'https://santiagolimpio.guamanpoma.org/uploads/mapa.png'
                            }></CardMedia> */}
              {selectedRoute.geometry && (
                <Box sx={{ height: '50vh', marginTop: '16px', maxHeight: '400px' }}>
                <LoadScript googleMapsApiKey="AIzaSyCmQgrrg7yzPFqhKC_zFkyAQ5CKH6GNgBY">
                  <GoogleMap
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={{
                      lat: selectedRoute.geometry.coordinates[0][0][0].lat,
                      lng: selectedRoute.geometry.coordinates[0][0][0].lng,
                    }}
                    zoom={14.8}
                  >
                    {selectedRoute.geometry.coordinates.map((feature, index) => (
                      <Polyline
                        key={index}
                        path={feature.flat()}
                        options={{
                          strokeColor: '#0000FF',
                          strokeOpacity: 1.0,
                          strokeWeight: 2,
                        }}
                      />
                    ))}
                  </GoogleMap>
                </LoadScript>
              </Box>
              
              )}
                   
              <Button onClick={handleSaveChanges} variant="contained" color="primary" sx={{ marginTop: '16px' }}>
                Guardar cambios
              </Button>
              <Button onClick={handleCloseModal} sx={{ marginTop: '8px' }}>
                Cerrar
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography>Cargando detalles de la ruta...</Typography>
            </Box>
          )}
        </Box>
      </Modal>
      {/* Dialog de Confirmación */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirmar Guardado</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Estás seguro de guardar los cambios en la ruta?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={confirmSaveChanges} color="primary" autoFocus>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Definir el estilo del modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', // Usa un porcentaje para hacerlo responsivo
  maxWidth: '600px', // Máximo ancho para pantallas grandes
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
  overflowY: 'auto', // Permite desplazamiento si el contenido es largo
  maxHeight: '90vh', // Altura máxima para pantallas pequeñas
};
