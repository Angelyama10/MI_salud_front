// Servicios reparados para usar el token de autenticación
import { REACT_URI_API } from '@env';

const ApiUrl = `${REACT_URI_API}/users`;

// Filtrar por ID
export const getUserById = async (id, token) => {
  try {
    if (!id) throw new Error("El ID es requerido para filtrar el usuario.");
    if (!token) throw new Error("El token es requerido para autenticar la solicitud.");

    const url = `${ApiUrl}/user?id=${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Agrega el token al encabezado
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error al obtener usuario por ID:", errorDetails);
      throw new Error(errorDetails.message || 'Error al obtener usuario por ID');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getUserById:", error.message);
    throw error;
  }
};

// Eliminar usuario
export const deleteUserById = async (id, token) => {
  try {
    if (!id) throw new Error("El ID es requerido para eliminar el usuario.");
    if (!token) throw new Error("El token es requerido para autenticar la solicitud.");

    const url = `${ApiUrl}/delete?id=${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Agrega el token al encabezado
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error al eliminar usuario:", errorDetails);
      throw new Error(errorDetails.message || 'Error al eliminar usuario');
    }

    const data = await response.json();
    console.log("Usuario eliminado correctamente:", data);
    return data;
  } catch (error) {
    console.error("Error en deleteUserById:", error.message);
    throw error;
  }
};

// Actualizar usuario
export const updateUserById = async (id, updatedData, token) => {
  try {
    if (!id) throw new Error("El ID es requerido para actualizar el usuario.");
    if (!updatedData || typeof updatedData !== 'object') {
      throw new Error("Los datos actualizados son requeridos y deben ser un objeto.");
    }
    if (!token) throw new Error("El token es requerido para autenticar la solicitud.");

    const url = `${ApiUrl}/update?id=${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Agrega el token al encabezado
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error al actualizar usuario:", errorDetails);
      throw new Error(errorDetails.message || 'Error al actualizar usuario');
    }

    const data = await response.json();
    console.log("Usuario actualizado correctamente:", data);
    return data;
  } catch (error) {
    console.error("Error en updateUserById:", error.message);
    throw error;
  }
};
