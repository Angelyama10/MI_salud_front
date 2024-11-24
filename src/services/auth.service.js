import { REACT_URI_API } from '@env';

const ApiUrl = REACT_URI_API;

export const auth = async (dataUser) => {
  try {
    console.log("URL de la API:", `${ApiUrl}/auth/login`);
    
    const response = await fetch(`${ApiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: dataUser.email,
        contraseña: dataUser.contraseña,
      }),
    });

    console.log("Estado de la respuesta:", response.status);

    // Revisamos si la solicitud fue exitosa
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en autenticación (detalle):", errorText);
      throw new Error(`Error en autenticación: ${errorText}`);
    }

    // Si la autenticación es correcta, parseamos la respuesta JSON
    const dataAuth = await response.json();
    console.log("Respuesta de autenticación:", dataAuth);

    // Retorna los datos de autenticación (incluido el token)
    return dataAuth;
  } catch (error) {
    console.error("Error en autenticación (catch):", error);
    throw error;
  }
};
