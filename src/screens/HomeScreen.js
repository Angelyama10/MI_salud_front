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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationBarComponent from '../components/NavigationBarComponents';
import ModalMedicamento from '../components/ModalMedicamento';
import { getMedicamentos } from '../services/medicamentos.service';
import { TokenContext } from '../context/TokenContext';
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused(); // Para detectar cuando la pantalla vuelve a ser visible
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
      fetchMedicamentos(); // Recargar datos cada vez que la pantalla está activa
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
          <Text style={styles.noMedicamentos}>No hay medicamentos disponibles</Text>
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
  noMedicamentos: {
    fontSize: 16,
    color: '#777777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
