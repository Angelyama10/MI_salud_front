import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';

const FromComponents = ({ navigation, onRegister, placeholders }) => {
  const [username, setUsername] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateFields = () => {
    if (!username || !lastName || !birthdate || !gender || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return false;
    }
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthdate)) {
      Alert.alert('Error', 'La fecha debe estar en formato dd/mm/aaaa.');
      return false;
    }
    const [day, month, year] = birthdate.split('/').map(Number);
    if (year < 1900 || year > new Date().getFullYear()) {
      Alert.alert('Error', 'El año debe ser válido.');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'El correo electrónico no es válido.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      const [day, month, year] = birthdate.split('/');
      const formattedBirthdate = `${year}-${month}-${day}`; // Convertimos a formato ISO

      const userData = {
        nombre: username.trim(),
        apellido: lastName.trim(),
        fechaN: formattedBirthdate,
        sexo: gender === 'Masculino' ? 'M' : 'F',
        email: email.trim(),
        contraseña: password.trim(),
        confirmarC: confirmPassword.trim(),
      };

      onRegister(userData);
    }
  };

  return (
    <View style={styles.formContainer}>
      {/* Campos del Formulario */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholders.username}
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#777"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholders.lastName}
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="#777"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholders.birthdate}
          value={birthdate}
          onChangeText={(text) => {
            const formattedDate = text
              .replace(/\D/g, '') // Solo números
              .replace(/(\d{2})(\d{2})?(\d{4})?/, (match, d, m, y) => {
                if (y) return `${d}/${m}/${y}`;
                if (m) return `${d}/${m}`;
                return d;

              });
            setBirthdate(formattedDate);
          }}
          keyboardType="numeric"
          placeholderTextColor="#777"
          maxLength={10}
        />
      </View>

      {/* Selección de Género */}
      <Text style={styles.genderLabel}>Género</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === 'Masculino' && styles.genderButtonSelected,
          ]}
          onPress={() => setGender('Masculino')}
        >
          <Text
            style={[
              styles.genderText,
              gender === 'Masculino' && styles.genderTextSelected,
            ]}
          >
            Masculino
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === 'Femenino' && styles.genderButtonSelected,
          ]}
          onPress={() => setGender('Femenino')}
        >
          <Text
            style={[
              styles.genderText,
              gender === 'Femenino' && styles.genderTextSelected,
            ]}
          >
            Femenino
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholders.email}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#777"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholders.password}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#777"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholders.confirmPassword}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor="#777"
        />
      </View>

      {/* Botón de Registro */}
      <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
        <Text style={styles.registerButtonText}>Registrarte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    height: 45, // Altura del campo
    borderColor: '#CCC', // Color del borde (gris claro)
    borderWidth: 1, // Borde completo alrededor del campo
    borderRadius: 8, // Bordes redondeados
    paddingHorizontal: 10, // Espaciado interno
    fontSize: 16, // Tamaño del texto
    backgroundColor: '#FFF', // Fondo blanco
    color: '#000', // Texto negro
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: '100%',
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#FFF',
  },
  genderButtonSelected: {
    backgroundColor: '#5A9BD3',
    borderColor: '#5A9BD3',
  },
  genderText: {
    color: '#777',
  },
  genderTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#5A9BD3',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FromComponents;