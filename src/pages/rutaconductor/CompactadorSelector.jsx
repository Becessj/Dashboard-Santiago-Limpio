import React, { useEffect, useState } from 'react';
import { TextField, MenuItem } from '@mui/material';

const CompactadorSelector = ({ selectedRoute, setSelectedRoute }) => {
    const [compactadores, setCompactadores] = useState([]);
    const [selectedTruck, setSelectedTruck] = useState(selectedRoute.properties.truck); // Inicializa el estado con el valor actual de selectedRoute.truck

    useEffect(() => {
        // Realizar la solicitud para obtener los compactadores
        fetch('http://localhost:3001/api/trucks') // Ajusta la URL según tu configuración
            .then(response => response.json())
            .then(data => {
                setCompactadores(data);
            })
            .catch(error => console.error('Error fetching trucks:', error));
    }, []);

    const handleTruckChange = (e) => {
        setSelectedTruck(e.target.value);
        // Actualizar la selectedRoute con el nuevo valor de truck
        setSelectedRoute({ ...selectedRoute, properties: { ...selectedRoute.properties, truck: e.target.value } });
    };

    return (
        <TextField
            select
            label="Compactador"
            value={selectedTruck}
            fullWidth
            margin="normal"
            onChange={handleTruckChange}
        >
            {compactadores.map((compactador) => (
                <MenuItem key={compactador.id} value={compactador.id}>
                    {compactador.name}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default CompactadorSelector;
