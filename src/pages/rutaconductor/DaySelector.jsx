import React, { useState, useEffect } from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

const DaySelector = ({ selectedRoute, setSelectedRoute }) => {
  const [days, setDays] = useState([
    { label: 'Lunes', value: 'Lunes', checked: false },
    { label: 'Martes', value: 'Martes', checked: false },
    { label: 'Miércoles', value: 'Miércoles', checked: false },
    { label: 'Jueves', value: 'Jueves', checked: false },
    { label: 'Viernes', value: 'Viernes', checked: false },
    { label: 'Sábado', value: 'Sábado', checked: false },
    { label: 'Domingo', value: 'Domingo', checked: false },
  ]);

  // Cargar días iniciales cuando selectedRoute.properties.days cambia
  useEffect(() => {
    if (selectedRoute?.properties?.days) {
      const daysFromDB = selectedRoute.properties.days.split(',').map((day) => day.trim());
      const updatedDays = days.map((day) => ({
        ...day,
        checked: daysFromDB.includes(day.value),
      }));
      setDays(updatedDays);
    }
  }, [selectedRoute?.properties?.days]);

  const handleCheckboxChange = (dayValue) => {
    const updatedDays = days.map((day) =>
      day.value === dayValue ? { ...day, checked: !day.checked } : day
    );

    setDays(updatedDays);

    // Actualiza selectedRoute con los días seleccionados
    const selectedDays = updatedDays
      .filter((day) => day.checked)
      .map((day) => day.value)
      .join(', '); // Convertir a string para la base de datos

    setSelectedRoute({
      ...selectedRoute,
      properties: { ...selectedRoute.properties, days: selectedDays },
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Selecciona los días
      </Typography>
      <FormGroup row> {/* row coloca los checkboxes horizontalmente */}
        {days.map((day) => (
          <FormControlLabel
            key={day.value}
            control={
              <Checkbox
                checked={day.checked}
                onChange={() => handleCheckboxChange(day.value)}
              />
            }
            label={day.label}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default DaySelector;
