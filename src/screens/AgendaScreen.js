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
import AntDesign from 'react-native-vector-icons/AntDesign';
import AnnotationTypeModal from './AnnotationTypeModal';
import DateComponent from '../components/DateComponent';
import { postAgenda } from '../services/agenda.service';
import { TokenContext } from '../context/TokenContext'; // Importa el contexto

const { width } = Dimensions.get('window');

const AgendaScreen = ({ navigation }) => {
  const [nota, setNota] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState({
    label: 'general',
    color: '#008080',
  });
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useContext(TokenContext); // Extrae el token del contexto

  const selectType = (type) => {
    setSelectedType(type);
    setModalVisible(false);
  };

  const handleSave = async () => {
    if (!token) {
      Alert.alert('Error', 'No estás autenticado. Por favor, inicia sesión.');
      return;
    }

    if (!nota.trim()) {
      Alert.alert('Error', 'La descripción no puede estar vacía.');
      return;
    }

    const nombre = nota.split(' ').slice(0, 3).join(' ');

    const agendaData = {
      nombre,
      descripcion: nota,
      hora: date.toISOString(),
      tipo: selectedType.label,
    };

    console.log('Datos enviados a la API para crear agenda:', agendaData);

    try {
      setIsLoading(true);
      await postAgenda(token, agendaData);
      Alert.alert('Éxito', 'La agenda ha sido creada correctamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error en handleSave:', error);
      Alert.alert('Error', 'No se pudo crear la agenda. Por favor, verifica tu autenticación.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.navigate('AnotacionScreen')}>
            <Icon name="arrow-left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Agregar anotación</Text>
          <TouchableOpacity onPress={handleSave} disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Guardando...' : 'Aceptar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Descripción</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={4}
          onChangeText={(text) => setNota(text)}
          value={nota}
          placeholder="Escribe aquí tu descripción"
        />
        <View style={styles.dateContainer}>
          <DateComponent selectedDate={date} onDateChange={setDate} />
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#008080',
    padding: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  dateContainer: {
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  dateAndTypeSection: {
    marginBottom: 10,
  },
  annotationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  annotationTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  annotationTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  annotationType: {
    fontSize: 16,
  },
  warningText: {
    fontSize: 12,
    color: '#555',
    marginTop: 20,
  },
});

export default AgendaScreen;
