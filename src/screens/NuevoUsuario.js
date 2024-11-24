import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Nuevo icono
import FromComponents from '../components/FromComponents';
import { registerUser } from '../services/usuario.service';


const NuevoUsuario = ({ navigation }) => {
  const handleRegister = async (userData) => {
    if (typeof registerUser !== 'function') {
      console.error('registerUser no está definido correctamente.');
      return;
    }
  
    try {
      console.log('Datos enviados al registro:', userData);
      const response = await registerUser(userData);
      Alert.alert('Éxito', 'Usuario registrado correctamente');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message || 'Hubo un problema al procesar el registro');
      console.error('Error en handleRegister:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Encabezado con Icono */}
      <View style={styles.topContainer}>
        <Icon name="account-plus" size={100} color="#5A9BD3" />
        <Text style={styles.title}>Rellena tus datos</Text>
      </View>

      {/* Formulario */}
      <FromComponents
        onRegister={handleRegister}
        navigation={navigation}
        placeholders={{
          username: 'Nombres',
          lastName: 'Apellidos',
          birthdate: 'Fecha de nacimiento (dd/mm/aaaa)',
          gender: 'Sexo',
          password: 'Contraseña',
          confirmPassword: 'Confirmar contraseña',
          email: 'Correo electrónico',
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
  },
  topContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 10,
    color: '#333333',
  },
});

export default NuevoUsuario;
