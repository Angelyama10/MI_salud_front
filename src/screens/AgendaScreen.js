import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AnnotationTypeModal from './AnnotationTypeModal'; 
import DateComponent from '../components/DateComponent';

const { width, height } = Dimensions.get('window');

const AgendaScreen = ({ navigation }) => {
    const [nota, setNota] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedType, setSelectedType] = useState({
        label: 'General',
        color: '#008080',
    });

    const selectType = (type) => {
        setSelectedType(type);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Icon name="arrow-left" size={24} color="#ffffff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Agregar anotación</Text>
                    <TouchableOpacity onPress={() => {/* Funcionalidad para guardar la nota */ }}>
                        <Text style={styles.buttonText}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionLabel}>Anotación</Text>
    <TextInput
        style={styles.textInput}
        multiline
        numberOfLines={4}
        onChangeText={(text) => setNota(text)}
        value={nota}
        placeholder="Escribe aquí tu anotación"
    />
    <View style={styles.dateContainer}>
        <DateComponent />
    </View>

                <View style={styles.infoSection}>
                    
                    <View style={styles.dateAndTypeSection}>
                        <TouchableOpacity
                            style={styles.annotationRow}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={styles.annotationTypeTitle}>Tipo</Text>
                            <View style={styles.annotationTypeRow}>
                                <View
                                    style={[
                                        styles.colorDot,
                                        { backgroundColor: selectedType.color },
                                    ]}
                                />
                                <Text style={styles.annotationType}>
                                    {selectedType.label}
                                </Text>
                                <AntDesign name="right" size={24} color="black" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.warningText}>
                    Atención: La información que ingrese aquí es para su propia referencia. En caso de emergencia, por favor contacte a su servicio de emergencia local (911). También le recordamos que consulte a su médico sobre cualquier medicamento o cualquier pregunta que pueda tener sobre sus servicios de salud.
                </Text>

                {/* Modal para seleccionar tipo de anotación */}
                <AnnotationTypeModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    selectType={selectType}
                />
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
        fontSize: width * 0.06,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    sectionLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    textInput: {
        borderColor: '#EAF2F8',
        backgroundColor: '#EAF2F8',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        height: 150,
        textAlignVertical: 'top',
        fontSize: 16,
        color: '#333',
    },
    dateContainer: {
        backgroundColor: '#EAF2F8',
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
        justifyContent: 'center',
    },
    infoSection: {
        marginTop: 20,
    },
    dateAndTypeSection: {
        backgroundColor: '#EAF2F8',
        borderRadius: 10,
        padding: 10,
    },
    annotationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    annotationTypeTitle: {
        fontSize: 16,
        color: '#333',
    },
    annotationTypeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    annotationType: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
        marginRight: 10, 
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    warningText: {
        marginTop: 20,
        fontSize: 14,
        color: 'red',
    },
});


export default AgendaScreen;
