import React, { useEffect, useState, useContext } from 'react';
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
import { getAppointments } from '../services/citas.service'; // Servicio para obtener citas
import { TokenContext } from '../context/TokenContext'; // Contexto para obtener el token

const { width, height } = Dimensions.get('window');

const MedicalAppointmentsScreen = ({ navigation }) => {
  const { token } = useContext(TokenContext); // Obtener el token desde el contexto
  const [loading, setLoading] = useState(true); // Estado de carga
  const [appointments, setAppointments] = useState([]); // Estado para almacenar las citas

  // Función para obtener las citas médicas desde la API
  const fetchAppointments = async () => {
    try {
      const data = await getAppointments(token); // Llamar al servicio con el token
      setAppointments(data); // Actualizar las citas obtenidas
    } catch (error) {
      console.error('Error al cargar las citas médicas:', error.message);
    } finally {
      setLoading(false); // Finalizar el estado de carga
    }
  };

  // Llamar a la función al cargar la pantalla
  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Citas</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AppointmentScreen')}>
          <Icon name="plus" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#5A9BD3" />
        ) : appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <TouchableOpacity
              key={index}
              style={styles.appointmentContainer}
              onPress={() =>
                navigation.navigate('AppointmentDetailScreen', { id: appointment.id })
              }
            >
              <Text style={styles.date}>{appointment.date}</Text>
              <View style={styles.appointmentCard}>
                <Icon name="calendar" size={30} style={styles.icon} />
                <View>
                  <Text style={styles.title}>{appointment.title}</Text>
                  <Text style={styles.description}>{appointment.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <Icon name="book-outline" size={100} color="#7B61FF" />
            <Text style={styles.noDataTitle}>Organice sus citas médicas</Text>
            <Text style={styles.noDataDescription}>
              Escriba sus visitas médicas y reciba un recordatorio por adelantado.
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AppointmentScreen')}
            >
              <Text style={styles.addButtonText}>Añadir una visita</Text>
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
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  appointmentContainer: {
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 10,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
    color: '#555555',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  description: {
    fontSize: 14,
    color: '#777777',
    marginTop: 3,
  },
  noDataContainer: {
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

export default MedicalAppointmentsScreen;
