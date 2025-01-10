import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Alert,
    DialogContentText,
    TablePagination,
    CircularProgress,
    Backdrop,
    Grid,
    Select,
    MenuItem,IconButton , Box
} from '@mui/material';
import Badge from '@mui/material/Badge';
import { EditOutlined, DeleteOutlined , FileAddOutlined ,BellOutlined} from '@ant-design/icons';
const NotificationsTable = () => {
    const [actionMessage, setActionMessage] = useState('');
    const [actionSuccess, setActionSuccess] = useState(true); // Para indicar si fue éxito o error
    const [showAlert, setShowAlert] = useState(false); // 
    const [notifications, setNotifications] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [formError, setFormError] = useState('');
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    const [isLoading, setIsLoading] = useState(true);
    const [filteredStatus, setFilteredStatus] = useState(''); // Filtro por estado
  const [sortOrder, setSortOrder] = useState('desc'); // Orden de fechas
  const [sortField, setSortField] = useState('date_start'); // Campo de ordenamiento (por fecha de inicio)
    const [currentNotification, setCurrentNotification] = useState({
        id: null,
        title: '',
        text: '',
        date_start: new Date().toISOString().split('T')[0],
        date_end: new Date().toISOString().split('T')[0],
        image_url: '',
        status: 'ACTIVO'
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        // Ejecutar updateNotifications primero, luego fetchNotifications
        const updateAndFetchNotifications = async () => {
          await updateNotifications();  // Primero actualizamos las notificaciones
          fetchNotifications();         // Luego obtenemos las notificaciones
        };
      
        updateAndFetchNotifications();  // Llamada a la función combinada
      
      }, []); // Ejecutar solo al montar el componente
      const handleAlert = (message, success = true) => {
        setActionMessage(message);
        setActionSuccess(success);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000); // Desaparecer el alert después de 3 segundos
      };
    
      const updateNotifications = async () => {
          try {
              const response = await fetch('http://localhost:3001/api/update-notifications', {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
              });
      
              if (!response.ok) {
                  throw new Error("Error al actualizar las notificaciones");
              }
      
              const data = await response.json();
              
          } catch (error) {
              console.error("Error en la solicitud:", error.message);
          }
      };
      
      const fetchNotifications = async () => {
          try {
            setIsLoading(true);  // Inicia el loading
              const response = await fetch('http://localhost:3001/api/notifications');
              if (!response.ok) throw new Error('Error al obtener las notificaciones');
              const data = await response.json();
              // Ordenar las notificaciones por id en orden descendente
              const sortedData = data.sort((a, b) => b.id - a.id); 
              setNotifications(sortedData);
          } catch (error) {
              console.error('Error:', error);
          }
          finally {
            setIsLoading(false);  // Detiene el loading
        }
      };
    
// Filtro por estado
const handleFilterChange = (event) => {
    setFilteredStatus(event.target.value);
  };

  // Ordenar las notificaciones
  const handleSort = (field) => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; // Alternar orden
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  // Filtrar y ordenar las notificaciones
  const filteredNotifications = notifications.filter(notification =>
    filteredStatus ? notification.status === filteredStatus : true
  );

  const sortedNotifications = filteredNotifications.sort((a, b) => {
    const dateA = new Date(a[sortField]);
    const dateB = new Date(b[sortField]);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

    const handleDialogOpen = (notification = null) => {
        if (notification) {
            setEditMode(true);
            setCurrentNotification(notification);
            setPreviewImage(notification.image_url);
        } else {
            setEditMode(false);
            setCurrentNotification(
                notification || {
                    id: null,
                    title: '',
                    text: '',
                    date_start: new Date().toISOString().split('T')[0],
                    date_end: new Date().toISOString().split('T')[0],
                    image_url: '',
                    status: 'ACTIVO'
                }
            );
            setPreviewImage('');
        }
        setFormError('');
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentNotification((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setIsLoadingImage(true);

        try {
            const response = await fetch('http://localhost:3001/api/upload-to-cloudinary', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Error al subir la imagen');
            const data = await response.json();

            setCurrentNotification((prev) => ({ ...prev, image_url: data.filePath }));
            setPreviewImage(data.filePath);
        } catch (error) {
            console.error('Error:', error);
            setFormError('No se pudo subir la imagen.');
        } finally {
            setIsLoadingImage(false);
        }
    };

    const validateForm = () => {
        if (!currentNotification.title || !currentNotification.text || !currentNotification.date_start || !currentNotification.date_end) {
            setFormError('Los campos "Título", "Contenido", "Imagen", "Fecha de inicio" y "Fecha de fin" son obligatorios.');
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;
    
        const url = editMode
            ? `http://localhost:3001/api/notifications/${currentNotification.id}`
            : 'http://localhost:3001/api/notifications';
        const method = editMode ? 'PUT' : 'POST';
    
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentNotification),
            });
            if (!response.ok) throw new Error('Error al guardar la notificación');
    
            fetchNotifications();
            handleDialogClose();
            handleAlert('Notificación agregada correctamente', true);
            setActionMessage(editMode ? 'Notificación actualizada con éxito.' : 'Notificación agregada con éxito.');
            setActionSuccess(true);
        } catch (error) {
            setActionMessage('Error al guardar la notificación.');
            setActionSuccess(false);
        }
    };
    
    

    const confirmDelete = (id) => {
        setDeleteId(id);
        setOpenConfirmDialog(true);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/notifications/${deleteId}`, {
                method: 'DELETE'
            });
            handleAlert('Notificación eliminada correctamente', true); // Mensaje de éxito
            if (!response.ok) throw new Error('Error al eliminar la notificación');
    
            fetchNotifications();
            setOpenConfirmDialog(false);
    
            setActionMessage('Notificación eliminada con éxito.');
            setActionSuccess(true);
        } catch (error) {
            setActionMessage('Error al eliminar la notificación.');
            setActionSuccess(false);
        }
    };
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="container">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
        <h2>Listado de Notificaciones</h2>
        <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>
            <FileAddOutlined />&nbsp;  Agregar
        </Button>
    </div>
    <hr style={{ margin: '20px 0', border: '1px solid #ddd' }} />

  

            <TableContainer component={Paper}>
                
    {isLoading ? (
   
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
        </Box>

    ) : (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Título</TableCell>
                    <TableCell>Contenido</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Desde</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Hasta</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Imagen</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Estado</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Acción</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {notifications
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((notification) => (
                        <TableRow key={notification.id}>
                            <TableCell>{notification.id}</TableCell>
                            <TableCell style={{ width: '500px' }}>
                                {notification.title.split(' ').slice(0, 10).join(' ') + (notification.title.split(' ').length > 10 ? '...' : '')}
                            </TableCell>
                            <TableCell style={{ whiteSpace: 'pre-line', wordWrap: 'break-word', maxHeight: '100px', overflow: 'hidden', width: '700px' }}>
                                {notification.text.split(' ').slice(0, 18).join(' ') + (notification.text.split(' ').length > 18 ? '...' : '')}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center', width: '120px' }}>{new Date(notification.date_start).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</TableCell>
                            <TableCell style={{ textAlign: 'center', width: '120px' }}>{new Date(notification.date_end).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                                <img
                                    src={notification.image_url || "https://santiagolimpio.guamanpoma.org/noborrar/camion.png"}
                                    alt={notification.title}
                                    style={{ maxWidth: '50px', maxHeight: '50px' }}
                                />
                            </TableCell>
                            <TableCell style={{ textAlign: 'center', width: '120px' }}>
                                <Badge
                                    badgeContent={notification.status}
                                    color={notification.status === 'ACTIVO' ? 'success' : 'error'}  // Verde si es ACTIVO, rojo si es INACTIVO
                                >
                                </Badge>
                                </TableCell>

                            <TableCell style={{ textAlign: 'center', width: '120px' }}>
                                <IconButton color="primary" onClick={() => handleDialogOpen(notification)}>
                                    <EditOutlined />
                                </IconButton>
                                <IconButton color="secondary" onClick={() => confirmDelete(notification.id)} style={{ marginLeft: '10px' }}>
                                    <DeleteOutlined />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
        
    )}
       {showAlert && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 700,
            left: 0,
            right: 0,
            padding: '10px',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            animation: 'fadeIn 1s',
          }}
        >
          <Alert severity={actionSuccess ? 'success' : 'error'}>{actionMessage}</Alert>
        </Box>
      )}
</TableContainer>


            <TablePagination
                component="div"
                count={notifications.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Filas por página:"
            />

                            {/* Diálogo para agregar/editar */}
                <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>{editMode ? 'Editar Notificación' : 'Agregar Notificación'}</DialogTitle>
                    <DialogContent style={{ minWidth: '300px' }}>
                        {formError && <Alert severity="error">{formError}</Alert>}
                        <TextField
                            autoFocus
                            margin="dense"
                            name="title"
                            label="Título"
                            type="text"
                            fullWidth
                            value={currentNotification.title}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            name="text"
                            label="Contenido"
                            type="text"
                            fullWidth
                            multiline
                            minRows={4}
                            value={currentNotification.text}
                            onChange={handleInputChange}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="date_start"
                                    label="Fecha de Inicio"
                                    type="date"
                                    fullWidth
                                    disabled
                                    value={currentNotification.date_start.split('T')[0]}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    name="date_end"
                                    label="Fecha de Fin"
                                    type="date"
                                    fullWidth
                                    value={currentNotification.date_end.split('T')[0]}
                                    onChange={handleInputChange}
                                    // Establecemos el valor mínimo de date_end como el valor de date_start
                                    inputProps={{
                                        min: today
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Select
                                name="status"
                                value={currentNotification.status}
                                onChange={handleInputChange}
                                fullWidth
                                margin="dense"
                            >
                                <MenuItem value="ACTIVO">ACTIVO</MenuItem>
                                <MenuItem value="INACTIVO">INACTIVO</MenuItem>
                            </Select>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginTop: '16px' }} />
                        {isLoadingImage && <CircularProgress style={{ marginTop: '16px' }} />}
                        {previewImage && <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', marginTop: '16px' }} />}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="secondary">
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} color="primary">
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>




            {/* Modal de confirmación */}
            <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>¿Estás seguro de que deseas eliminar esta notificación?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="primary">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default NotificationsTable;
