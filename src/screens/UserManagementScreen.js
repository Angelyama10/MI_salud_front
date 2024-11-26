import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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
    nuevaContraseña: '',
    confirmarContraseña: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) handleFetchUser();
  }, [userId]);

  const handleFetchUser = async () => {
    try {
      setLoading(true);
      const user = await getUserById(userId, token);
      console.log('Usuario cargado desde el servidor:', user);

      setForm({
        id: user.id,
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        fechaN: user.fechaN ? user.fechaN.split('T')[0] : '',
        sexo: user.sexo || '',
        email: user.email || '',
        nuevaContraseña: '',
        confirmarContraseña: '',
      });
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
      Alert.alert('Error', 'No se pudo cargar los datos del usuario.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUpdates = async () => {
    if (form.nuevaContraseña && form.nuevaContraseña !== form.confirmarContraseña) {
      return Alert.alert('Error', 'Las contraseñas no coinciden.');
    }

    try {
      const updatedUser = {
        nombre: form.nombre,
        apellido: form.apellido,
        fechaN: form.fechaN,
        sexo: form.sexo,
        email: form.email,
        ...(form.nuevaContraseña && { contraseña: form.nuevaContraseña }),
      };

      console.log('Datos enviados para actualización:', updatedUser);

      await updateUserById(userId, updatedUser, token);

      updateUserData({ userName: form.nombre });

      Alert.alert('Éxito', 'Usuario actualizado correctamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'No se pudo actualizar los datos del usuario.'
      );
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserById(userId, token);
      Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada exitosamente.');
      setToken(null); // Eliminar token y cerrar sesión
      navigation.replace('Login'); // Redirigir al login
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      Alert.alert('Error', error.message || 'No se pudo eliminar tu cuenta.');
    }
  };
  

  const handleLogout = () => {
    setToken(null);
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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

      {/* Sección de cambio de contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Nueva Contraseña (opcional)"
        secureTextEntry
        value={form.nuevaContraseña}
        onChangeText={(text) => setForm({ ...form, nuevaContraseña: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Nueva Contraseña"
        secureTextEntry
        value={form.confirmarContraseña}
        onChangeText={(text) => setForm({ ...form, confirmarContraseña: text })}
      />

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
    </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserManagementScreen;
