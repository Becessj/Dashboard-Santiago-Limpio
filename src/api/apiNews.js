const BASE_URL = 'http://localhost:3001/api';

export const fetchNoticias = async () => {
    try {
        const response = await fetch(`${BASE_URL}/news`);
        if (!response.ok) throw new Error('Error al obtener las notificaciones');
        const data = await response.json();
        return data.sort((a, b) => b.id - a.id); // Ordenar por id descendente
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`${BASE_URL}/upload-to-cloudinary`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Error al subir la imagen');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const saveNoticia = async (noticia, editMode) => {
    const url = editMode ? `${BASE_URL}/news/${noticia.id}` : `${BASE_URL}/news`;
    const method = editMode ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noticia),
        });
        if (!response.ok) throw new Error('Error al guardar la notificación');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const deleteNoticia = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/news/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar la notificación');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
