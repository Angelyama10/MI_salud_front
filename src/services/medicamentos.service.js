import { REACT_URI_API } from '@env';

const ApiUrl = `${REACT_URI_API}/medicamentos`;

export const getMedicamentos = async (token) => {
  if (!token) throw new Error('Token no disponible');
  try {
    const response = await fetch(ApiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error al obtener medicamentos: ${errorText}`);
      throw new Error('Error al obtener medicamentos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getMedicamentos:', error);
    throw error;
  }
};



export const getMedicamentoById = async (token, id) => {
  if (!token) throw new Error('Token no disponible');
  try {
    const response = await fetch(`${ApiUrl}/empaque?id=${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener medicamento: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data) {
      throw new Error('Respuesta vacía del servidor.');
    }

    return data;
  } catch (error) {
    console.error('Error en getMedicamentoById:', error);
    throw error;
  }
};



export const updateMedicamentoById = async (token, id, updatedData) => {
  if (!token) throw new Error('Token no disponible');

  try {
    // Ajustar la ruta del endpoint para incluir `/update?id=`
    const url = `${ApiUrl}/update?id=${id}`;
    console.log('URL:', url);
    console.log('Datos enviados al servidor:', updatedData);

    const response = await fetch(url, {
      method: 'PUT', // Verifica si realmente debe ser PUT. Si es POST, cámbialo.
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error al actualizar medicamento:', errorText);
      throw new Error('Error al actualizar medicamento');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en updateMedicamentoById:', error);
    throw error;
  }
};




export const deleteMedicamentoById = async (token, id) => {
  if (!token) throw new Error('Token no disponible');
  try {
    const response = await fetch(`${ApiUrl}/delete?id=${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error al eliminar medicamento: ${errorText}`);
      throw new Error('Error al eliminar el medicamento.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en deleteMedicamentoById:', error);
    throw error;
  }
};

export const postMedicamentos = async (token, dataMed) => {
  if (!token) throw new Error('Token no disponible');
  try {
    const response = await fetch(ApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataMed),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error al insertar medicamento: ${errorText}`);
      throw new Error(`Error al insertar medicamento: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en postMedicamentos:', error);
    throw error;
  }
};

export const getMedicamentoDosisById = async (token, id) => {
  if (!token) throw new Error('Token no disponible');

  try {
    const url = `${ApiUrl}/dosis/one?id=${id}`;
    console.log(`Fetching data from URL: ${url}`); // Consola la URL completa

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Token de autorización
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error al obtener las dosis del medicamento: ${errorText}`);
      throw new Error('Error al obtener las dosis del medicamento');
    }

    const data = await response.json();
    if (!data) {
      throw new Error('Respuesta vacía del servidor.');
    }

    return data; // Devuelve los datos completos del medicamento
  } catch (error) {
    console.error('Error en getMedicamentoDosisById:', error);
    throw error;
  }
};

export const getDosesByMedicationId = async (token, id) => {
  if (!token) throw new Error('Token no disponible');

  try {
    const url = `${ApiUrl}/medicamentos/dosis?id=${id}`;
    console.log(`Fetching data from URL: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error al obtener las dosis: ${errorText}`);
      throw new Error('Error al obtener las dosis');
    }

    const data = await response.json();
    if (!data) {
      throw new Error('Respuesta vacía del servidor.');
    }

    return data;
  } catch (error) {
    console.error('Error en getDosesByMedicationId:', error);
    throw error;
  }
};

export const fetchMedicamentoConDosisById = async (token, id) => {
  if (!token) throw new Error('Token no disponible');

  try {
    // Construir la URL con el ID del medicamento
    const url = `${ApiUrl}/dosis/one?id=${id}`;
    console.log(`Fetching data from URL: ${url}`); // Para depuración

    // Hacer la petición
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Token de autorización
        'Content-Type': 'application/json',
      },
    });

    // Manejar errores HTTP
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error al obtener las dosis del medicamento: ${errorText}`);
      throw new Error('Error al obtener las dosis del medicamento');
    }

    // Parsear y devolver los datos de la respuesta
    const data = await response.json();
    if (!data) {
      throw new Error('Respuesta vacía del servidor.');
    }

    console.log('Datos obtenidos de las dosis del medicamento:', data); // Log para depuración
    return data; // Devuelve los datos completos del medicamento
  } catch (error) {
    console.error('Error en fetchMedicamentoConDosisById:', error);
    throw error;
  }
};