import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createDoctor } from '../services/doctors.service'; // Importa el servicio para crear médicos
import { TokenContext } from '../context/TokenContext'; // Importa el contexto para obtener el token

const { width, height } = Dimensions.get('window');

const AddDoctorScreen = ({ navigation }) => {
    const { token } = useContext(TokenContext); // Usar el token desde el contexto

    // Estados para los campos del formulario
    const [doctorName, setDoctorName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [emergencyNumber, setEmergencyNumber] = useState('');
    const [address, setAddress] = useState('');

    // Función para manejar la creación del médico
    const handleSave = async () => {
        const doctorData = {
            nombre: doctorName,
            especialidad: specialty,
            email,
            telefonoOficina: phoneNumber,
            telefonoMovil: mobileNumber,
            telefonoEmergencia: emergencyNumber,
            direccion: address,
        };

        try {
            console.log('Datos enviados al servicio:', doctorData);
            await createDoctor(token, doctorData); // Llamar al servicio
            Alert.alert('Éxito', 'Médico añadido correctamente.');
            navigation.navigate('DoctorsScreen'); // Redirigir a DoctorsScreen
        } catch (error) {
            console.error('Error al añadir médico:', error);
            Alert.alert('Error', 'No se pudo añadir el médico.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Añadir Médico</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Campos de entrada */}
                {[
                    { placeholder: 'Nombre del médico', value: doctorName, setValue: setDoctorName, icon: 'doctor' },
                    { placeholder: 'Especialidad', value: specialty, setValue: setSpecialty, icon: 'medical-bag' },
                    { placeholder: 'Email', value: email, setValue: setEmail, icon: 'email', keyboardType: 'email-address' },
                    { placeholder: 'Teléfono de oficina', value: phoneNumber, setValue: setPhoneNumber, icon: 'phone', keyboardType: 'phone-pad' },
                    { placeholder: 'Teléfono móvil', value: mobileNumber, setValue: setMobileNumber, icon: 'cellphone', keyboardType: 'phone-pad' },
                    { placeholder: 'Teléfono de emergencia', value: emergencyNumber, setValue: setEmergencyNumber, icon: 'phone-in-talk', keyboardType: 'phone-pad' },
                    { placeholder: 'Dirección', value: address, setValue: setAddress, icon: 'map-marker' },
                ].map((field, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.inputRow}>
                            <Icon name={field.icon} size={24} color="#5A9BD3" />
                            <TextInput
                                style={styles.input}
                                placeholder={field.placeholder}
                                value={field.value}
                                onChangeText={field.setValue}
                                keyboardType={field.keyboardType || 'default'}
                            />
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { padding: 16, backgroundColor: '#5A9BD3', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    buttonText: { color: '#FFF', fontSize: 16 },
    content: { padding: 16 },
    card: { backgroundColor: '#FFF', marginVertical: 8, padding: 12, borderRadius: 8 },
    inputRow: { flexDirection: 'row', alignItems: 'center' },
    input: { flex: 1, marginLeft: 10, fontSize: 16 },
});

export default AddDoctorScreen;
