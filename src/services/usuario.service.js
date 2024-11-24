import { useContext } from 'react';
import { TokenContext } from '../context/TokenContext'; // Importa el contexto del token
import { REACT_URI_API } from '@env';

const ApiUrl = `${REACT_URI_API}/users`;

export const registerUser = async (userData) => {
  try {
    console.log("Datos que se envían a la API para registrar usuario:", userData);

    const response = await fetch(ApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error al registrar usuario:", errorDetails);
      throw new Error(errorDetails.message || 'Error al registrar usuario');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en registerUser:", error.message);
    throw error;
  }
};
