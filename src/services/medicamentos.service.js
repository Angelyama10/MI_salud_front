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



export const updateMedicamentoById = async (token, id, medicamentoData) => {
  if (!token) throw new Error('Token no disponible');
  try {
    const response = await fetch(`${ApiUrl}/update?id=${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicamentoData), // Enviar el objeto completo
    });

    const responseText = await response.text();
    console.log('Respuesta del servidor:', responseText);

    if (!response.ok) {
      throw new Error(`Error al actualizar medicamento: ${responseText}`);
    }

    return JSON.parse(responseText);
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
