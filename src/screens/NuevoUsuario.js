import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FromComponents from '../components/FromComponents';
import { registerUser } from '../services/usuario.service';
import ErrorModal from '../components/ErrorModal';

const { width, height } = Dimensions.get('window');

const NuevoUsuario = ({ navigation }) => {
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateFields = (userData) => {
    const {
      username,
      lastName,
      birthdate,
      gender,
      password,
      confirmPassword,
      email,
    } = userData;

    if (!username || !lastName || !birthdate || !gender || !password || !confirmPassword || !email) {
      return 'Todos los campos son obligatorios.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'El correo electrónico no es válido.';
    }

    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden.';
    }

    const birthdateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!birthdateRegex.test(birthdate)) {
      return 'La fecha de nacimiento debe estar en el formato dd/mm/aaaa.';
    }

    const [day, month, year] = birthdate.split('/').map(Number);
    const birthDateObj = new Date(year, month - 1, day);
    if (isNaN(birthDateObj.getTime()) || birthDateObj > new Date()) {
      return 'La fecha de nacimiento no es válida.';
    }

    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDateObj.getFullYear();
    if (age < 18) {
      return 'Debes ser mayor de edad para registrarte.';
    }

    return null;
  };

  const handleRegister = async (userData) => {
    const error = validateFields(userData);

    if (error) {
      setErrorMessage(error);
      setErrorVisible(true);
      return;
    }

    try {
      const response = await registerUser(userData);
      Alert.alert('Éxito', 'Usuario registrado correctamente');
      navigation.navigate('Login');
    } catch (error) {
      setErrorMessage(error.message || 'Hubo un problema al procesar el registro.');
      setErrorVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Sección Blanca */}
        <View style={styles.whiteSection}>
          <FontAwesome name="users" size={70} color="#5A9BD3" />
          <Text style={styles.title}>Rellena tus datos</Text>
        </View>

        {/* Sección Azul */}
        <View style={styles.blueSection}>
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
        </View>
      </ScrollView>

      {/* Modal de Error */}
      <ErrorModal
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  whiteSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: width * 0.1,
    borderBottomRightRadius: width * 0.1,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 10,
    color: '#333333',
  },
  blueSection: {
    flex: 1,
    backgroundColor: '#DCEFFF',
    paddingHorizontal: '8%',
    paddingVertical: 20,
    borderTopLeftRadius: width * 0.1,
    borderTopRightRadius: width * 0.1,
  },
});

export default NuevoUsuario;
