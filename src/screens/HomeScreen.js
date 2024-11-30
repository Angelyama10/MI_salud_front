import React, { useEffect, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import DateComponent from '../components/DateComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationBarComponent from '../components/NavigationBarComponents';
import ModalMedicamento from '../components/ModalMedicamento';
import { getMedicamentos } from '../services/medicamentos.service';
import { TokenContext } from '../context/TokenContext';
import { useIsFocused } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { token, userData, medicamentos, setMedicamentos } = useContext(TokenContext);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);

  const navItems = [
    { text: 'Inicio', iconName: 'home-heart', onPress: () => navigation.navigate('Home') },
    { text: 'Progreso', iconName: 'chart-bar', onPress: () => navigation.navigate('Progress') },
    { text: 'Más', iconName: 'dots-horizontal', onPress: () => console.log('Más presionado') },
  ];

  const determinarAccion = (unidad) => {
    const acciones = {
      tabletas: 'Tomar',
      pastillas: 'Tomar',
      ampollas: 'Aplicar',
      aerosol: 'Aplicar',
      pomada: 'Aplicar',
      crema: 'Aplicar',
    };
    return acciones[unidad.toLowerCase()] || 'Usar';
  };

  const obtenerIcono = (unidad) => {
    const iconos = {
      tabletas: 'pill',
      pastillas: 'pill',
      ampollas: 'needle',
      aerosol: 'spray',
      pomada: 'tube',
      crema: 'tube',
      jarabe: 'bottle-tonic',
      gotas: 'water',
    };
    return iconos[unidad.toLowerCase()] || 'pill';
  };

  const fetchMedicamentos = async () => {
    try {
      setLoading(true);
      const data = await getMedicamentos(token);
      const medicamentosTransformados = data.flatMap((med) =>
        med.dosis.map((dosis) => ({
          id: med.id,
          hora: dosis.hora_dosis,
          nombre: med.nombre,
          dosis: `${determinarAccion(med.unidad)} ${dosis.cantidadP} ${med.unidad}`,
          icon: obtenerIcono(med.unidad),
        }))
      );
      setMedicamentos(medicamentosTransformados);
    } catch (error) {
      console.error('Error al cargar medicamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && isFocused) {
      fetchMedicamentos();
    }
  }, [token, isFocused]);

  const abrirModal = (medicamento) => {
    setMedicamentoSeleccionado(medicamento);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerContent}
          onPress={() => navigation.navigate('UserManagementScreen', { userId: userData?.userId })}
        >
          <Icon name="account-circle" size={width * 0.1} color="#FFFFFF" />
          <Text style={styles.headerText}>
            {userData?.userName ? `${userData.userName}` : 'Inicio'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Fecha */}
      <View style={styles.dateContainer}>
        <DateComponent />
      </View>

      {/* Medicamentos */}
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#5A9BD3" />
        ) : medicamentos.length > 0 ? (
          medicamentos.map((medicamento, index) => (
            <TouchableOpacity
              key={index}
              style={styles.medicamentoContainer}
              onPress={() => abrirModal(medicamento)}
            >
              <Text style={styles.hora}>{medicamento.hora}</Text>
              <View style={styles.medicamentoCard}>
                <Icon name={medicamento.icon} size={30} style={styles.icon} />
                <View>
                  <Text style={styles.nombre}>{medicamento.nombre}</Text>
                  <Text style={styles.dosis}>{medicamento.dosis}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
  <Ionicons name="calendar-sharp" size={80} color="#5A9BD3" style={styles.emptyIcon} />
  <Text style={styles.emptyTitle}>¡Cuidamos de Ti en Misalud!</Text>
  <Text style={styles.emptySubtitle}>
    Tu salud es nuestra prioridad. Comienza a registrar tu información para un mejor control y seguimiento.
  </Text>
  <TouchableOpacity
    style={styles.emptyButton}
    onPress={() => navigation.navigate('Search')}
  >
              <Text style={styles.emptyButtonText}>Agregar Medicamento</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Barra de Navegación */}
      <NavigationBarComponent navItems={navItems} navigation={navigation} />

      {/* Modal */}
      {medicamentoSeleccionado && (
        <ModalMedicamento
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          id={medicamentoSeleccionado?.id}
          nombre={medicamentoSeleccionado?.nombre}
          hora={medicamentoSeleccionado?.hora}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingVertical: height * 0.03,
    backgroundColor: '#5A9BD3',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  dateContainer: {
    backgroundColor: '#E9F7FE',
    padding: 10,
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  medicamentoContainer: {
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  hora: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 10,
  },
  medicamentoCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
    color: '#555555',
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  dosis: {
    fontSize: 14,
    color: '#777777',
    marginTop: 3,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'Yanone Kaffeesatz',
    textAlign: 'center',
    color: '#333333',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555555',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#5A9BD3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 88,

  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50, // Space from the top
    paddingHorizontal: 30, // Padding for the entire container
  },
  emptyIcon: {
    marginBottom: 20, // Space below the icon
  },
  emptyTitle: {
    fontSize: 20, // Larger text
    fontWeight: 'bold', // Emphasize the title
    textAlign: 'center',
    color: '#333333',
    marginBottom: 10, // Space below the title
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555555',
    marginBottom: 20, // Space below the subtitle
    lineHeight: 22, // Improve readability
  },
  emptyButton: {
    backgroundColor: '#5A9BD3',
    paddingVertical: 14, // Increased button padding
    paddingHorizontal: 30, // Wider button
    borderRadius: 20, // Rounded corners
    elevation: 3, // Shadow for a modern feel
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16, // Slightly larger text
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
