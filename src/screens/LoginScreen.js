import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { auth } from '../services/auth.service';
import { TokenContext } from '../context/TokenContext';
import ErrorModal from '../components/ErrorModal'; // Componente del modal de error
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

const { width, height } = Dimensions.get('window');

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { setToken } = useContext(TokenContext);

  const handleLogin = async () => {
    if (!email || !contraseña) {
      setErrorMessage('Por favor, ingresa el correo y la contraseña');
      setErrorVisible(true);
      return;
    }

    setLoading(true);
    try {
      const response = await auth({ email, contraseña });

      if (response?.access_token) {
        const decodedToken = decodeJWT(response.access_token);
        console.log('Datos decodificados del JWT:', decodedToken);

        const userId = decodedToken?.sub;
        const userName = decodedToken?.username;

        if (!userId || !userName) throw new Error('Datos de usuario incompletos en el token');

        await setToken(response.access_token, userId, userName);

        navigation.navigate('Home');
      } else {
        throw new Error('Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setErrorMessage(error.message || 'Error al iniciar sesión. Intenta de nuevo.');
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient colors={['#B5D6FD', '#FFFFFF']} style={styles.background}>
        <View style={styles.contentContainer}>
          <View style={styles.topContainer}>
            <Text style={styles.welcomeText}>Bienvenido</Text>
            <Image
              source={require('../../assets/images/Login.jpg')}
              style={styles.loginImage}
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.loginText}>Iniciar sesión</Text>

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#888"
              secureTextEntry
              value={contraseña}
              onChangeText={setContraseña}
            />

            {loading ? (
              <ActivityIndicator size="large" color="#5A9BD3" />
            ) : (
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Entrar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => console.log('Navegación a recuperación de contraseña')}
            >
              <Text style={styles.forgotPasswordText}>Recuperar contraseña</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.noAccountText}>¿No tienes una cuenta?</Text>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('Nuevo')}
              >
                <Text style={styles.registerButtonText}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ErrorModal
          visible={errorVisible}
          message={errorMessage}
          onClose={() => setErrorVisible(false)}
        />
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: '8%',
  },
  topContainer: {
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  welcomeText: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: height * 0.015,
  },
  loginImage: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'contain',
  },
  formContainer: {
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  loginText: {
    fontSize: width * 0.06,
    color: '#000000',
    marginBottom: height * 0.02,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: height * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#FFFFFF',
    fontSize: width * 0.045,
    color: '#000',
    marginBottom: height * 0.015,
  },
  loginButton: {
    width: '100%',
    height: height * 0.065,
    backgroundColor: '#5A9BD3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.02,
    marginTop: height * 0.015,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    fontSize: width * 0.04,
    color: '#5A9BD3',
    marginTop: height * 0.015,
    textDecorationLine: 'underline',
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: height * 0.025,
    alignItems: 'center',
  },
  noAccountText: {
    fontSize: width * 0.042,
    color: '#000',
  },
  registerButton: {
    marginLeft: width * 0.01,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#5A9BD3',
    borderRadius: width * 0.02,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.042,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
