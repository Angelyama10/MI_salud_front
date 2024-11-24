import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAgendas } from '../services/agenda.service';

const AnotacionScreen = ({ navigation }) => {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgendas();
  }, []);

  const fetchAgendas = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error("No se encontró el token de autenticación");
        throw new Error("No se encontró el token de autenticación");
      }

      const data = await getAgendas(token); // Llama al servicio con el token
      setAgendas(data);
    } catch (error) {
      console.error('Error al cargar las agendas:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Agenda</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AgendaScreen')}>
          <Icon name="plus" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#5A9BD3" />
        ) : agendas.length > 0 ? (
          agendas.map((agenda) => (
            <TouchableOpacity
              key={agenda.id}
              style={styles.agendaItem}
              onPress={() => navigation.navigate('AgendaDetailScreen', { id: agenda.id })}
            >
              <Text style={styles.agendaTitle}>{agenda.title}</Text>
              <Text style={styles.agendaDate}>
                {new Date(agenda.date).toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="notebook-outline" size={80} color="#5A9BD3" />
            <Text style={styles.emptyTitle}>No hay agendas registradas</Text>
            <Text style={styles.emptyDescription}>
              Agrega una nueva nota para comenzar a gestionar tus pendientes.
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AgendaScreen')}
            >
              <Text style={styles.addButtonText}>Añadir una nota</Text>
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
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#5A9BD3',
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    padding: 16,
  },
  agendaItem: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  agendaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  agendaDate: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginVertical: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  addButton: {
    padding: 12,
    backgroundColor: '#5A9BD3',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AnotacionScreen;
