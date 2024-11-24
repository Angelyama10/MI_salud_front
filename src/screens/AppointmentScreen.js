import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/locale/es';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const AppointmentScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [doctor, setDoctor] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [note, setNote] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    // Cargar la fecha guardada desde AsyncStorage al montar el componente
    useEffect(() => {
        const loadTime = async () => {
            try {
                const storedTime = await AsyncStorage.getItem('appointmentTime');
                if (storedTime) {
                    setTime(storedTime);
                }
            } catch (error) {
                console.error('Error loading time from AsyncStorage:', error);
            }
        };
        loadTime();
    }, []);

    const handleConfirm = async (selectedDate) => {
        setDatePickerVisibility(false);
        const formattedDate = moment(selectedDate).locale('es').format('dddd, D [de] MMMM [de] YYYY, h:mm A');
        setTime(formattedDate);

        // Guardar la fecha y hora seleccionada en AsyncStorage
        try {
            await AsyncStorage.setItem('appointmentTime', formattedDate);
        } catch (error) {
            console.error('Error saving time to AsyncStorage:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="#ffffff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Agrega Agendamiento</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <TextInput
                    style={styles.input}
                    placeholder="Escriba título de la cita"
                    value={title}
                    onChangeText={text => setTitle(text)}
                />
                <TouchableOpacity style={styles.input}>
                    <Text style={styles.placeholderText}>
                        {doctor ? doctor : 'Elige médico'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setDatePickerVisibility(true)}
                >
                    <Text style={styles.placeholderText}>
                        {time ? time : 'Configure hora del agendamiento'}
                    </Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Ubicación"
                    value={location}
                    onChangeText={text => setLocation(text)}
                />
                <TextInput
                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                    placeholder="Escribir Anotación"
                    value={note}
                    multiline
                    onChangeText={text => setNote(text)}
                />
            </ScrollView>

            <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {/* Funcionalidad para guardar */ }}
            >
                <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={() => setDatePickerVisibility(false)}
                locale="es_ES"
                is24Hour
            />
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
        alignItems: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
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
    input: {
        borderColor: '#EAF2F8',
        backgroundColor: '#EAF2F8',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        marginTop: 15,
        fontSize: 16,
        color: '#333',
    },
    placeholderText: {
        color: '#7A7A7A',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#5A9BD3',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        marginHorizontal: 20,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AppointmentScreen;
