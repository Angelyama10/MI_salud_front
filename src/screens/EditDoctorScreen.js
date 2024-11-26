import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDoctorById, updateDoctor, deleteDoctor } from '../services/doctors.service';
import { TokenContext } from '../context/TokenContext'; // Importa el contexto

const EditDoctorScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const { token } = useContext(TokenContext); // Obtener el token del contexto

    const [doctorData, setDoctorData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                if (!token) throw new Error('Token no disponible en el contexto.');
                const data = await getDoctorById(id, token); // Pasar el token explícitamente
                setDoctorData(data);
            } catch (error) {
                console.error('Error al obtener el médico:', error);
                Alert.alert('Error', 'No se pudieron cargar los datos del médico.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchDoctor();
    }, [id, token]);
    

    const handleUpdate = async () => {
        try {
          const updatedData = {
            nombre: doctorData.nombre,
            especialidad: doctorData.especialidad,
            email: doctorData.email,
            telefonoOficina: doctorData.telefonoOficina,
            telefonoMovil: doctorData.telefonoMovil,
            telefonoEmergencia: doctorData.telefonoEmergencia,
            direccion: doctorData.direccion,
          };
      
          console.log("Datos preparados para actualizar:", updatedData);
      
          await updateDoctor(token, id, updatedData);
          Alert.alert('Éxito', 'Médico actualizado correctamente.');
          navigation.goBack();
        } catch (error) {
          console.error('Error al actualizar el médico:', error);
          Alert.alert('Error', 'No se pudo actualizar el médico.');
        }
      };
      

      const handleDelete = async () => {
        Alert.alert(
          'Confirmar eliminación',
          '¿Estás seguro de que deseas eliminar este médico?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Eliminar',
              onPress: async () => {
                try {
                  console.log("ID a eliminar:", id);
                  console.log("Token utilizado:", token);
      
                  await deleteDoctor(token, id); // Pasa el token y el ID correctamente
                  Alert.alert('Éxito', 'Médico eliminado correctamente.');
                  navigation.goBack();
                } catch (error) {
                  console.error('Error al eliminar el médico:', error);
                  Alert.alert('Error', 'No se pudo eliminar el médico.');
                }
              },
            },
          ]
        );
      };
      

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Editar Médico</Text>
                <TouchableOpacity onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {Object.entries(doctorData).map(([key, value]) => (
                    <View key={key} style={styles.card}>
                        <TextInput
                            style={styles.input}
                            placeholder={key}
                            value={value}
                            onChangeText={(text) => setDoctorData({ ...doctorData, [key]: text })}
                        />
                    </View>
                ))}
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>Eliminar Médico</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { padding: 16, backgroundColor: '#5A9BD3', flexDirection: 'row', justifyContent: 'space-between' },
    headerText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    buttonText: { color: '#FFF', fontSize: 16 },
    content: { padding: 16 },
    card: { backgroundColor: '#FFF', marginVertical: 8, padding: 12, borderRadius: 8 },
    input: { fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#CCC' },
    deleteButton: { backgroundColor: '#D9534F', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    deleteButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});

export default EditDoctorScreen;
