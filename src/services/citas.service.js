import { useContext } from 'react';
import { TokenContext } from '../context/TokenContext';

const BASE_URL = `${REACT_URI_API}/medicos`;

// Obtener médico por ID
export const getDoctorById = async (id) => {
  const { token } = useContext(TokenContext); // Obtén el token del contexto

  if (!id) throw new Error('ID no proporcionado para obtener médico.');
  if (!token) throw new Error('Token no disponible en el contexto.');

  try {
    const url = `${BASE_URL}/view?id=${id}`;
    console.log("URL utilizada para obtener médico por ID:", url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Incluir el token en las cabeceras
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

// Actualizar médico
export const updateDoctor = async (id, updatedData) => {
  const { token } = useContext(TokenContext);

  if (!id) throw new Error('ID no proporcionado para actualizar médico.');
  if (!token) throw new Error('Token no disponible en el contexto.');

  try {
    const url = `${BASE_URL}/update?id=${id}`;
    console.log("URL utilizada para actualizar médico:", url);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error(`Error en updateDoctor: ${response.status} - ${errorResponse.message}`);
      throw new Error('Error al actualizar el médico.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updateDoctor:', error);
    throw error;
  }
};

// Eliminar médico
export const deleteDoctor = async (id) => {
  const { token } = useContext(TokenContext);

  if (!id) throw new Error('ID no proporcionado para eliminar médico.');
  if (!token) throw new Error('Token no disponible en el contexto.');

  try {
    const url = `${BASE_URL}/delete?id=${id}`;
    console.log("URL utilizada para eliminar médico:", url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error(`Error en deleteDoctor: ${response.status} - ${errorResponse.message}`);
      throw new Error('Error al eliminar el médico.');
    }

    console.log("Médico eliminado correctamente.");
    return { success: true };
  } catch (error) {
    console.error('Error en deleteDoctor:', error);
    throw error;
  }
};
