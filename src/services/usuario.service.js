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

    const data = await response.json();

    // Si la respuesta no es exitosa pero contiene un mensaje de éxito
    if (!response.ok) {
      if (data.message?.includes('successfully deleted')) {
        console.warn("El servidor retornó un estado inesperado, pero la cuenta fue eliminada.");
        return data;
      }
      console.error("Error al eliminar usuario:", data);
      throw new Error(data.message || 'Error al eliminar usuario');
    }

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

// Obtener la contraseña desencriptada
export const getDecryptedPassword = async (userId, token) => {
  try {
    const response = await fetch(`${ApiUrl}/decrypt-password/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Error en la respuesta al desencriptar la contraseña:', errorDetails);
      throw new Error(errorDetails.message || 'Error al desencriptar la contraseña.');
    }

    const data = await response.json();
    console.log('Contraseña desencriptada obtenida del servidor:', data);
    return data.password; // Asegúrate de que el servidor retorne la contraseña en este formato
  } catch (error) {
    console.error('Error al obtener la contraseña desencriptada:', error);
    throw error;
  }
};
