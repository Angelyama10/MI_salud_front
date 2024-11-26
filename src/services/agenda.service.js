import { REACT_URI_API } from '@env';

const ApiUrl = `${REACT_URI_API}/agenda`; // Ruta completa con /agenda

// Obtener todas las agendas
export const getAgendas = async (token) => {
  try {
    console.log("URL utilizada para obtener agendas:", ApiUrl);

    const response = await fetch(ApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la respuesta de getAgendas: ${response.status} - ${errorText}`);
      throw new Error('Error al obtener las agendas');
    }

    const data = await response.json();
    console.log("Datos de agendas desde el servicio:", data);
    return data;
  } catch (error) {
    console.error("Error en getAgendas:", error);
    return [];
  }
};

// Crear una nueva agenda
export const postAgenda = async (token, agendaData) => {
  try {
    console.log('Token usado en postAgenda:', token);
    console.log('Datos enviados a la API:', agendaData);

    const response = await fetch(ApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agendaData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error al crear la agenda: ${errorText}`);
      throw new Error(`Error al crear la agenda: ${errorText}`);
    }

    const data = await response.json();
    console.log('Respuesta de la API:', data);
    return data;
  } catch (error) {
    console.error('Error en postAgenda:', error);
    throw error;
  }
};

// Obtener una agenda por ID
export const getAgendaById = async (token, id) => {
  try {
    const url = `${ApiUrl}/view?id=${id}`;
    console.log("URL utilizada para obtener agenda por ID:", url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log(`Error en la respuesta de getAgendaById: ${response.status}`);
      throw new Error('Error al obtener la agenda');
    }

    const data = await response.json();
    console.log("Datos de la agenda obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error en getAgendaById:", error);
    throw error;
  }
};

// Actualizar una agenda existente
export const updateAgenda = async (token, id, agendaData) => {
  try {
    const url = `${ApiUrl}/update?id=${id}`;
    console.log("URL utilizada para actualizar la agenda:", url);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agendaData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error al actualizar la agenda: ${errorText}`);
      throw new Error(`Error al actualizar agenda: ${errorText}`);
    }

    const data = await response.json();
    console.log("Agenda actualizada correctamente:", data);
    return data;
  } catch (error) {
    console.error("Error en updateAgenda:", error);
    throw error;
  }
};

// Eliminar una agenda
export const deleteAgenda = async (token, id) => {
  try {
    const url = `${ApiUrl}/delete?id=${id}`;
    console.log("URL utilizada para eliminar la agenda:", url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error al eliminar la agenda: ${errorText}`);
      throw new Error(`Error al eliminar agenda: ${errorText}`);
    }

    console.log("Agenda eliminada correctamente");
    return { success: true };
  } catch (error) {
    console.error("Error en deleteAgenda:", error);
    throw error;
  }
};
