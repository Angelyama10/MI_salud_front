import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getUserById, deleteUserById, updateUserById } from '../services/usuario.service';
import { TokenContext } from '../context/TokenContext';

const UserManagementScreen = ({ route, navigation }) => {
  const { token, setToken, updateUserData } = useContext(TokenContext);
  const { userId } = route.params;

  const [form, setForm] = useState({
    id: userId || '',
    nombre: '',
    apellido: '',
    fechaN: '',
    sexo: '',
    email: '',
    contraseña: '******',
    confirmarC: '******',
  });

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (userId) handleFetchUser();
  }, [userId]);

  const handleFetchUser = async () => {
    try {
      const user = await getUserById(userId, token);
      setForm({
        id: user.id,
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        fechaN: user.fechaN ? user.fechaN.split('T')[0] : '',
        sexo: user.sexo || '',
        email: user.email || '',
        contraseña: '******', // Ocultamos inicialmente la contraseña
        confirmarC: '******', // Ocultamos inicialmente la contraseña
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar los datos del usuario.');
    }
  };

  const handleShowPassword = () => {
    const verifyPassword = async (input) => {
      try {
        if (input === 'your-verification-method') {
          const user = await getUserById(userId, token);
          setForm((prevForm) => ({
            ...prevForm,
            contraseña: user.contraseña,
            confirmarC: user.confirmarC,
          }));
          setPasswordVisible(true);
        } else {
          Alert.alert('Error', 'Contraseña incorrecta o dispositivo no autorizado.');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo verificar la contraseña.');
      }
    };

    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Ver Contraseña',
        'Ingresa tu contraseña o valida tu identidad:',
        (input) => verifyPassword(input),
        'secure-text',
      );
    } else {
      Alert.alert(
        'Ver Contraseña',
        'Por favor, valida tu identidad para mostrar la contraseña.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Aceptar',
            onPress: async () => {
              // Lógica para Android
              const user = await getUserById(userId, token); // Aquí puedes simular validación
              setForm((prevForm) => ({
                ...prevForm,
                contraseña: user.contraseña,
                confirmarC: user.confirmarC,
              }));
              setPasswordVisible(true);
            },
          },
        ],
      );
    }
  };

  const handleSaveUpdates = async () => {
    if (form.contraseña !== form.confirmarC) {
      return Alert.alert('Error', 'Las contraseñas no coinciden.');
    }

    try {
      const updatedUser = {
        nombre: form.nombre,
        apellido: form.apellido,
        fechaN: form.fechaN,
        sexo: form.sexo,
        email: form.email,
        ...(isPasswordVisible && { contraseña: form.contraseña }),
      };

      await updateUserById(userId, updatedUser, token);

      // Actualiza los datos del usuario en el contexto
      updateUserData({ userName: form.nombre });

      Alert.alert('Éxito', 'Usuario actualizado correctamente.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar los datos del usuario.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserById(userId, token);
      Alert.alert('Cuenta eliminada', 'El usuario ha sido eliminado.');
      setToken(null); // Cierra la sesión automáticamente
      navigation.replace('LoginScreen');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la cuenta.');
    }
  };

  const handleLogout = () => {
    setToken(null);
    navigation.replace('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Usuario</Text>

      {/* Campos del formulario */}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={form.nombre}
        onChangeText={(text) => setForm({ ...form, nombre: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={form.apellido}
        onChangeText={(text) => setForm({ ...form, apellido: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de Nacimiento (YYYY-MM-DD)"
        value={form.fechaN}
        onChangeText={(text) => setForm({ ...form, fechaN: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Sexo"
        value={form.sexo}
        onChangeText={(text) => setForm({ ...form, sexo: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry={!isPasswordVisible}
          value={form.contraseña}
          editable={false} // No editable hasta que se valide
        />
        <TouchableOpacity onPress={handleShowPassword}>
          <Icon name="eye-outline" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Botones */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveUpdates}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
          <Text style={styles.buttonText}>Eliminar Cuenta</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de cerrar sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#007BFF',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6347',
    padding: 10,
    marginTop: 30,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default UserManagementScreen;
