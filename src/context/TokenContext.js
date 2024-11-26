import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState({ userId: null, userName: '' });
  const [medicamentos, setMedicamentos] = useState([]); // Estado global de medicamentos
  const [doses, setDoses] = useState([]); // Estado global para las dosis

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUserName = await AsyncStorage.getItem('userName');

        if (storedToken) setToken(storedToken);
        if (storedUserId || storedUserName) {
          setUserData({ userId: storedUserId, userName: storedUserName });
        }
      } catch (error) {
        console.error('Error cargando datos desde AsyncStorage:', error);
      }
    };

    loadStoredData();
  }, []);

  const saveTokenAndUser = async (newToken, userId, userName) => {
    try {
      if (newToken) {
        await AsyncStorage.setItem('userToken', newToken);
        setToken(newToken);
      }
      if (userId) {
        await AsyncStorage.setItem('userId', userId.toString());
        setUserData((prev) => ({ ...prev, userId }));
      }
      if (userName) {
        await AsyncStorage.setItem('userName', userName);
        setUserData((prev) => ({ ...prev, userName }));
      }
    } catch (error) {
      console.error('Error guardando datos en AsyncStorage:', error);
    }
  };

  return (
    <TokenContext.Provider
      value={{
        token,
        userData,
        setToken: saveTokenAndUser,
        medicamentos,
        setMedicamentos, // Medicamentos globales
        doses,
        setDoses, // Estado global de dosis
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
