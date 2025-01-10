import React, { useEffect, useState } from 'react';import {
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
    IconButton, Box
} from '@mui/material';
import { EditOutlined, DeleteOutlined , FileAddOutlined } from '@ant-design/icons';
import { fetchNoticias, uploadImage, saveNoticia, deleteNoticia } from '../../api/apiNews';
const NoticiasTable = () => {
    const [noticias, setNoticias] = useState([]);
    const [actionMessage, setActionMessage] = useState('');
    const [actionSuccess, setActionSuccess] = useState(true);
    const [showAlert, setShowAlert] = useState(false); // 
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [formError, setFormError] = useState('');
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentNoticias, setCurrentNoticias] = useState({
        id: null,
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        image_url: ''
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleAlert = (message, success = true) => {
        setActionMessage(message);
        setActionSuccess(success);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // Desaparecer el alert después de 3 segundos
      };
    


    useEffect(() => {
        const loadNoticias = async () => {
            try {
                setIsLoading(true);
                const data = await fetchNoticias();
                setNoticias(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        loadNoticias();
    }, []);
    const handleDialogOpen = (noticia = null) => {
        if (noticia) {
            setEditMode(true);
            setCurrentNoticias(noticia);
            setPreviewImage(noticia.image_url);
        } else {
            setEditMode(false);
            setCurrentNoticias({
                id: null,
                title: '',
                content: '',
                date: new Date().toISOString().split('T')[0],
                image_url: ''
            });
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
        setCurrentNoticias((prev) => ({ ...prev, [name]: value }));
    };
    const validateForm = () => {
        if (!currentNoticias.title || !currentNoticias.content || !currentNoticias.image_url) {
            setFormError('Los campos "Título", "Contenido" y "Imagen" son obligatorios.');
            return false;
        }
        return true;
    };
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsLoadingImage(true);

        try {
            const data = await uploadImage(file);
            setCurrentNoticias((prev) => ({ ...prev, image_url: data.filePath }));
            setPreviewImage(data.filePath);
        } catch (error) {
            setFormError('No se pudo subir la imagen.');
        } finally {
            setIsLoadingImage(false);
        }
    };
    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            await saveNoticia(currentNoticias, editMode);
            const data = await fetchNoticias();
            setNoticias(data);
            handleDialogClose();
            handleAlert('Noticia agregada correctamente', true);
            setActionMessage(editMode ? 'Noticia actualizada con éxito.' : 'Noticia agregada con éxito.');
            setActionSuccess(true);
        } catch (error) {
            setActionMessage('Error al guardar la noticia.');
            setActionSuccess(false);
        }
    };
    const confirmDelete = (id) => {
        setDeleteId(id);
        setOpenConfirmDialog(true);
    };
    const handleDelete = async () => {
        try {
            await deleteNoticia(deleteId);
            const data = await fetchNoticias();
            handleAlert('Noticia eliminada correctamente', true); // Mensaje de éxito
            setNoticias(data);
            setOpenConfirmDialog(false);
            setActionMessage('Noticia eliminada con éxito.');
            setActionSuccess(true);
        } catch (error) {
            setActionMessage('Error al eliminar la Noticia.');
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
        <h2>Listado de Noticias</h2>
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
                <TableCell style={{ textAlign: 'center' }}>Fecha</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Imagen</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Acción</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {noticias
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((noticia) => (
                    <TableRow key={noticia.id}>
                        <TableCell>{noticia.id}</TableCell>
                        <TableCell style={{ width: '500px' }}>{noticia.title.split(' ').slice(0, 10).join(' ') + (noticia.title.split(' ').length > 10 ? '...' : '')} </TableCell>
                        <TableCell style={{ whiteSpace: 'pre-line', wordWrap: 'break-word', maxHeight: '100px', overflow: 'hidden', width: '700px' }}>
                            {noticia.content.split(' ').slice(0, 35).join(' ') + (noticia.content.split(' ').length > 35 ? '...' : '')}
                        </TableCell>

                        <TableCell style={{ textAlign: 'center' }}>
                             {new Date(noticia.date).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</TableCell>
                             <TableCell style={{ textAlign: 'center', width: '120px' }}>
                            <img
                                src={noticia.image_url}
                                alt={noticia.title}
                                style={{ maxWidth: '50px', maxHeight: '50px' }}
                            />
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleDialogOpen(noticia)}
                                            >
                                                <EditOutlined />
                                            </IconButton>
                                            <IconButton
                                                color="secondary"
                                                onClick={() => confirmDelete(noticia.id)}
                                                style={{ marginLeft: '10px' }}
                                            >
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
                count={noticias.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Filas por página:"
            />

            {/* Diálogo para agregar/editar */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{editMode ? 'Editar Noticia' : 'Agregar Noticia'}</DialogTitle>
                <DialogContent>
                    {formError && <Alert severity="error">{formError}</Alert>}
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Título"
                        type="text"
                        fullWidth
                        value={currentNoticias.title}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="content"
                        label="Contenido"
                        type="text"
                        fullWidth
                        multiline
                        minRows={4}
                        value={currentNoticias.content}
                        onChange={handleInputChange}
                    />
                  
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

export default NoticiasTable;
