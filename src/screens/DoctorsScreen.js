import React, { useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDoctors } from '../services/doctors.service'; // Servicio para obtener médicos
import { TokenContext } from '../context/TokenContext'; // Contexto para el token
import { useFocusEffect } from '@react-navigation/native'; // Hook para manejar el reenfoque

const { width, height } = Dimensions.get('window');

const DoctorsScreen = ({ navigation }) => {
  const { token } = useContext(TokenContext); // Usar el token del contexto
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);

  // Función para obtener los médicos
  const fetchDoctors = async () => {
    try {
      const data = await getDoctors(token); // Llamar al servicio
      setDoctors(data);
    } catch (error) {
      console.error('Error al cargar médicos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Usar `useFocusEffect` para recargar datos cada vez que la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Mostrar el indicador de carga mientras se actualiza
      fetchDoctors();
    }, [token]) // Dependemos del token para volver a cargar
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Médicos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddDoctorScreen')}>
          <Icon name="plus" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#5A9BD3" />
        ) : doctors.length > 0 ? (
          doctors.map((doctor, index) => (
            <TouchableOpacity
              key={index}
              style={styles.doctorCard}
              onPress={() => {
                console.log(`Navegando a EditDoctorScreen con ID: ${doctor.id}`);
                navigation.navigate('EditDoctorScreen', { id: doctor.id }); // Enviar el ID correcto
              }}
            >
              {/* Icono del médico */}
              <Icon name="doctor" size={40} color="#5A9BD3" style={styles.doctorIcon} />
              {/* Nombre del médico */}
              <Text style={styles.doctorName}>{doctor.nombre || 'Nombre no disponible'}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noData}>
            {/* Icono de médicos */}
            <Icon name="doctor" size={100} color="#5A9BD3" />
            {/* Mensaje cuando no hay médicos */}
            <Text style={styles.noDataTitle}>Escriba sus médicos</Text>
            <Text style={styles.noDataDescription}>
              Guarde una lista de sus profesionales de la salud.
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddDoctorScreen')}
            >
              <Text style={styles.addButtonText}>Añadir un médico</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    width: '100%',
    paddingVertical: height * 0.05,
    backgroundColor: '#5A9BD3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: width * 0.05,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  doctorIcon: {
    marginRight: 15,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  noDataTitle: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  noDataDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#5A9BD3',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DoctorsScreen;
