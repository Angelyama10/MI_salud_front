<<<<<<< HEAD
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

    console.log("Estado de la respuesta:", response.status); // Verifica el código de estado de la respuesta
    
    // Revisamos si la solicitud fue exitosa
    if (!response.ok) {
      const errorText = await response.text(); // Obtener el mensaje de error completo
      console.error("Error en autenticación (detalle):", errorText);
      throw new Error(`Error en autenticación: ${errorText}`);
    }

    // Si la autenticación es correcta, parseamos la respuesta JSON
    const dataAuth = await response.json();
    console.log("Respuesta de autenticación:", dataAuth); // Imprime la respuesta completa para verificar
    
    return dataAuth; // Esto debería contener el token si es exitoso
  } catch (error) {
    console.error("Error en autenticación (catch):", error);
=======
const ApiUrl = `${process.env.REACT_URI_API}/${process.env.Version}`;

export const auht = async (dataUser) => {
  try {
    const response = await fetch(`${ApiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'content-Type': 'application/json',
      },
      body: JSON.stringify(dataUser),
    });

    if (!response.ok) {
        throw new Error('error en la creacion del usuario');
      }
  
      const dataAuth= await response.json();
      return dataAuth;
  } catch (error) {
>>>>>>> 9f386f8759d2feb72ee3f01bfdae7d025dc909c5
    throw error;
  }
};
