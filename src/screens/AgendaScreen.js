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
import { TokenContext } from '../context/TokenContext';

const { width } = Dimensions.get('window');

const AgendaScreen = ({ navigation }) => {
  const [nota, setNota] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState({
    label: 'general',
    color: '#5A9BD3',
  });
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useContext(TokenContext);

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

    const nombre = nota.split(' ').slice(0, 6).join(' ');

    const agendaData = {
      nombre,
      descripcion: nota,
      hora: date.toISOString(),
      tipo: selectedType.label,
    };

    try {
      setIsLoading(true);
      await postAgenda(token, agendaData);
      Alert.alert('Éxito', 'La agenda ha sido creada correctamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error en handleSave:', error);
      Alert.alert('Error', 'No se pudo crear la agenda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Agregar anotación</Text>
        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Guardando...' : 'Aceptar'}
          </Text>
        </TouchableOpacity>
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

        <TouchableOpacity
          style={styles.annotationRow}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.annotationTypeTitle}>Tipo</Text>
          <View style={styles.annotationTypeRow}>
            <View
              style={[styles.colorDot, { backgroundColor: selectedType.color }]}
            />
            <Text style={styles.annotationType}>{selectedType.label}</Text>
            <AntDesign name="right" size={24} color="#333333" />
          </View>
        </TouchableOpacity>

        <Text style={styles.warningText}>
          Atención: La información que ingrese aquí es para su propia referencia. En caso de
          emergencia, por favor contacte a su servicio de emergencia local (911). También le
          recordamos que consulte a su médico sobre cualquier medicamento o pregunta relacionada con
          su salud.
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
    backgroundColor: '#FAFAFA', // Soft light background
  },
  header: {
    backgroundColor: '#5A9BD3', // Blue header
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  textInput: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#E9F7FE', // Light blue background
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
    height: 150,
    textAlignVertical: 'top',
  },
  dateContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  annotationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  annotationTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
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
    color: '#333333',
  },
  warningText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 20,
    lineHeight: 18,
    textAlign: 'center',
  },
});

export default AgendaScreen;
