import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import DateComponent from '../components/DateComponent';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationBarComponent from '../components/NavigationBarComponents';
import ModalMedicamento from '../components/ModalMedicamento'; 
import { getMedicamentos } from '../services/medicamentos.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const HomeDatos = ({ navigation }) => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState(new Date().getDate());
  const [modalVisible, setModalVisible] = useState(false);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);

  const navItems = [
    { text: 'Inicio', iconName: 'home-heart', onPress: () => navigation.navigate('Home') },
    { text: 'Progreso', iconName: 'chart-bar', onPress: () => navigation.navigate('Progress') },
    { text: 'Medicamentos', iconName: 'pill', onPress: () => navigation.navigate('Medicines') },
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

  const convertirHoraAFecha = (horaStr) => {
    const [time, modifier] = horaStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'p.m.' && hours < 12) hours += 12;
    if (modifier === 'a.m.' && hours === 12) hours = 0;

    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  };

  const fetchMedicamentos = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token no disponible');

      const data = await getMedicamentos(token);

      if (!Array.isArray(data)) {
        throw new Error('La respuesta de medicamentos no es válida.');
      }

      const medicamentosTransformados = data.flatMap((med) =>
        med.dosis
          .filter((dosis) => {
            const dosisHora = convertirHoraAFecha(dosis.hora_dosis);
            const ahora = new Date();
            return (
              dosisHora >= new Date(ahora.setHours(0, 0, 0, 0)) &&
              dosisHora <= new Date(ahora.setHours(23, 59, 59, 999))
            );
          })
          .map((dosis) => ({
            id: med.id,
            hora: dosis.hora_dosis,
            nombre: med.nombre,
            dosis: `${determinarAccion(med.unidad)} ${dosis.cantidadP} ${med.unidad}${
              dosis.momento_comida ? ` ${dosis.momento_comida}` : ''
            }`,
            icon: obtenerIcono(med.unidad),
            unidad: med.unidad,
            cantidad: dosis.cantidadP,
            momentoComida: dosis.momento_comida,
          }))
      );

      setMedicamentos(medicamentosTransformados);
    } catch (error) {
      console.error('Error al cargar medicamentos:', error);
      setMedicamentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicamentos();

    const intervalId = setInterval(() => {
      const today = new Date();
      if (today.getDate() !== currentDay) {
        setCurrentDay(today.getDate());
        fetchMedicamentos();
      }
    }, 3600000);

    return () => clearInterval(intervalId);
  }, [currentDay]);

  const abrirModal = (medicamento) => {
    if (!medicamento || !medicamento.id) {
      console.error('Medicamento inválido:', medicamento);
      return;
    }
    setMedicamentoSeleccionado(medicamento);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <DateComponent />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
                <Icon name={medicamento.icon} size={30} color="#555555" style={styles.icon} />
                <View>
                  <Text style={styles.nombre}>{medicamento.nombre}</Text>
                  <Text style={styles.dosis}>{medicamento.dosis}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No hay medicamentos disponibles.</Text>
        )}
      </ScrollView>
      <NavigationBarComponent navItems={navItems} navigation={navigation} />
      {medicamentoSeleccionado && (
        <ModalMedicamento
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        id={medicamentoSeleccionado?.id} // Pasar el ID
        nombre={medicamentoSeleccionado?.nombre}
        hora={medicamentoSeleccionado?.hora}
        unidad={medicamentoSeleccionado?.unidad}
        cantidad={medicamentoSeleccionado?.cantidad}
        momentoComida={medicamentoSeleccionado?.momentoComida}
        icono={medicamentoSeleccionado?.icon}
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
    paddingVertical: height * 0.02,
    backgroundColor: '#5A9BD3',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  medicamentoContainer: {
    marginBottom: 20,
    backgroundColor: '#E9F7FE', // Fondo suave para separar visualmente
    borderRadius: 10,
    padding: 15, // Espaciado interno para el contenido
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  hora: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555555',
    marginBottom: 5, // Separar la hora del resto del contenido
  },
  medicamentoCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15, // Separar el ícono del texto
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
    marginTop: 3, // Separar ligeramente las líneas de texto
  },
  noMedicamentos: {
    fontSize: 16,
    color: '#777777',
    textAlign: 'center',
    marginTop: 20,
  },
});


export default HomeDatos;
