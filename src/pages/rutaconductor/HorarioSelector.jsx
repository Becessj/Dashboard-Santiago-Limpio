import React, { useState, useEffect } from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';

const HorarioSelector = ({ selectedRoute, setSelectedRoute }) => {
    const defaultScheduleStart = selectedRoute?.properties?.schedule_start || "";
    const defaultScheduleEnd = selectedRoute?.properties?.schedule_end || "";

    const [scheduleStart, setScheduleStart] = useState(defaultScheduleStart);
    const [scheduleEnd, setScheduleEnd] = useState(defaultScheduleEnd);

    useEffect(() => {
        if (selectedRoute?.properties) {
            setScheduleStart(selectedRoute.properties.schedule_start || "");
            setScheduleEnd(selectedRoute.properties.schedule_end || "");
        }
    }, [selectedRoute]);

    const handleScheduleStartChange = (event) => {
        const value = event.target.value;
        setScheduleStart(value);
        setScheduleEnd(""); // Resetear el horario de fin al cambiar el inicio
        setSelectedRoute({
            ...selectedRoute,
            properties: {
                ...selectedRoute.properties,
                schedule_start: value,
                schedule_end: ""
            }
        });
    };

    const handleScheduleEndChange = (event) => {
        const value = event.target.value;
        setScheduleEnd(value);
        setSelectedRoute({
            ...selectedRoute,
            properties: {
                ...selectedRoute.properties,
                schedule_end: value
            }
        });
    };

    const generateTimeOptions = (startTime = "") => {
        const times = [];
        const [startHour, startMinute, startPeriod] = parseTime(startTime);

        for (let i = 0; i < 24; i++) {
            const hour = i % 12 === 0 ? 12 : i % 12;
            const period = i < 12 ? 'am' : 'pm';

            const timeSlots = [
                `${hour}:00 ${period}`,
                `${hour}:30 ${period}`
            ];

            timeSlots.forEach((slot) => {
                const isAfterStart = !startTime || compareTimes(slot, startHour, startMinute, startPeriod) > 0;
                if (isAfterStart) {
                    times.push(
                        <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                    );
                }
            });
        }
        return times;
    };

    const parseTime = (time) => {
        if (!time) return [0, 0, 'am'];
        const [hourMinute, period] = time.split(' ');
        const [hour, minute] = hourMinute.split(':').map(Number);
        return [hour, minute, period];
    };

    const compareTimes = (time, startHour, startMinute, startPeriod) => {
        const [hour, minute, period] = parseTime(time);
        const currentHour = period === 'pm' && hour !== 12 ? hour + 12 : hour;
        const startHour24 = startPeriod === 'pm' && startHour !== 12 ? startHour + 12 : startHour;

        if (currentHour !== startHour24) return currentHour - startHour24;
        return minute - startMinute;
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField
                    select
                    label="Hora de Inicio"
                    value={scheduleStart}
                    onChange={handleScheduleStartChange}
                    fullWidth
                    margin="normal"
                >
                    {generateTimeOptions()}
                </TextField>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    select
                    label="Hora de Fin"
                    value={scheduleEnd}
                    onChange={handleScheduleEndChange}
                    fullWidth
                    margin="normal"
                    disabled={!scheduleStart} // Deshabilitar si no hay hora de inicio seleccionada
                >
                    {generateTimeOptions(scheduleStart)}
                </TextField>
            </Grid>
        </Grid>
    );
};

export default HorarioSelector;
