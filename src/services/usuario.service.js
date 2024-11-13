const ApiUrl = `${process.env.REACT_URI_API}/${process.env.Version}`;

export const singUp = async data => {
  try {
    const response = await fetch(`${ApiUrl}/user`, {
      method: 'POST',
      headers: {
        'content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('error en la creacion del usuario');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
