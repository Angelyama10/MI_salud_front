import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const DoctorsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Médicos</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddDoctorScreen')}>
                    <Icon name="plus" size={24} color="#ffffff" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Icon
                    name="doctor"
                    size={100}
                    color="#5A9BD3" // Cambia el color si deseas un ícono diferente
                    style={styles.doctorIcon}
                />
                <Text style={styles.title}>Escriba sus médicos</Text>
                <Text style={styles.description}>
                    Guarde una lista de sus profesionales de la salud para conocer citas con familiares, contactarles y enviarles los informes de su estado
                </Text>
            </View>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddDoctorScreen')}
            >
                <Text style={styles.addButtonText}>Añadir un médico</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    doctorIcon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
    },
    description: {
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
        marginBottom: 30,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DoctorsScreen;
