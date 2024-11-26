import { REACT_URI_API } from '@env';

const ApiUrl = `${REACT_URI_API}/medicos`;

// Obtener todos los médicos
export const getDoctors = async (token) => {
  try {
    console.log("URL utilizada para obtener médicos:", ApiUrl);

    const response = await fetch(ApiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la respuesta de getDoctors: ${response.status} - ${errorText}`);
      throw new Error('Error al obtener los médicos');
    }

    const data = await response.json();
    console.log("Médicos obtenidos desde el servicio:", data);
    return data;
  } catch (error) {
    console.error("Error en getDoctors:", error);
    return [];
  }
};

// Crear un nuevo médico
export const createDoctor = async (token, doctorData) => {
  try {
    console.log("Datos enviados a la API para crear médico:", doctorData);

    const response = await fetch(ApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error al crear médico: ${response.status} - ${errorText}`);
      throw new Error(`Error al crear médico: ${errorText}`);
    }

    const data = await response.json();
    console.log("Médico creado exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error en createDoctor:", error);
    throw error;
  }
};

// Obtener un médico por ID
export const getDoctorById = async (id, token) => {
    if (!id) throw new Error('ID no proporcionado para obtener médico.');
    if (!token) throw new Error('Token no proporcionado.');
  
    try {
      const url = `https://misalud-back.onrender.com/v1/medicos/view?id=${id}`;
      console.log("URL utilizada para obtener médico por ID:", url);
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Aquí se envía el token en el encabezado
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error(`Error en getDoctorById: ${response.status} - ${errorResponse.message}`);
        throw new Error('Error al obtener el médico.');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error en getDoctorById:', error);
      throw error;
    }
  };
 

// Actualizar un médico existente
export const updateDoctor = async (token, id, doctorData) => {
  try {
    const url = `${ApiUrl}/update?id=${id}`;
    console.log("URL utilizada para actualizar médico:", url);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error al actualizar médico: ${response.status} - ${errorText}`);
      throw new Error(`Error al actualizar médico: ${errorText}`);
    }

    const data = await response.json();
    console.log("Médico actualizado exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error en updateDoctor:", error);
    throw error;
  }
};

// Eliminar un médico
export const deleteDoctor = async (token, id) => {
  try {
    const url = `${ApiUrl}/delete?id=${id}`;
    console.log("URL utilizada para eliminar médico:", url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error al eliminar médico: ${response.status} - ${errorText}`);
      throw new Error(`Error al eliminar médico: ${errorText}`);
    }

    console.log("Médico eliminado correctamente");
    return { success: true };
  } catch (error) {
    console.error("Error en deleteDoctor:", error);
    throw error;
  }
};
