// apiNotifications.js
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Actualiza las notificaciones.
 */
export const updateNotifications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Error al actualizar las notificaciones');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en la solicitud:', error.message);
    throw error;
  }
};

/**
 * Obtiene todas las notificaciones.
 */
export const fetchNotifications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications`);
    if (!response.ok) throw new Error('Error al obtener las notificaciones');
    return await response.json();
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

/**
 * Guarda o actualiza una notificación.
 */
export const saveNotification = async (notification, editMode) => {
  try {
    const url = editMode
      ? `${API_BASE_URL}/notifications/${notification.id}`
      : `${API_BASE_URL}/notifications`;
    const method = editMode ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification),
    });

    if (!response.ok) throw new Error('Error al guardar la notificación');
    return await response.json();
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

/**
 * Envía una notificación push.
 */
export const sendNotification = async (notification) => {
  try {
    const response = await fetch(`${API_BASE_URL}/send-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification),
    });

    if (!response.ok) throw new Error('Error al enviar la notificación');
    return await response.json();
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

/**
 * Elimina una notificación.
 */
export const deleteNotification = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Error al eliminar la notificación');
    return await response.json();
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};
