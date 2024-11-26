import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAgendaById, deleteAgenda, updateAgenda } from '../services/agenda.service';
import { TokenContext } from '../context/TokenContext';
import AnnotationTypeModal from './AnnotationTypeModal';

const AgendaDetailScreen = ({ route, navigation }) => {
  const { id } = route.params || {};
  const { token } = useContext(TokenContext);

  const [loading, setLoading] = useState(true);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editableFields, setEditableFields] = useState({
    nombre: '',
    hora: new Date(),
    tipo: 'General',
    descripcion: '',
  });

  const fetchAgendaDetails = async () => {
    try {
      const data = await getAgendaById(token, id);
      setEditableFields({
        nombre: data.nombre || '',
        hora: data.hora ? new Date(data.hora) : new Date(),
        tipo: data.tipo || 'General',
        descripcion: data.descripcion || '',
      });
    } catch (err) {
      Alert.alert('Error', 'No se pudo cargar la información.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Eliminar Agenda',
      '¿Estás seguro de que deseas eliminar esta agenda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAgenda(token, id);
              Alert.alert('Éxito', 'La agenda ha sido eliminada.');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'No se pudo eliminar la agenda.');
            }
          },
        },
      ]
    );
  };

  const handleUpdate = async () => {
    try {
      await updateAgenda(token, id, editableFields);
      Alert.alert('Éxito', 'La agenda ha sido actualizada.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar la agenda.');
    }
  };

  const handleSelectType = (type) => {
    setEditableFields({ ...editableFields, tipo: type.label });
    setShowTypeModal(false);
  };

  useEffect(() => {
    fetchAgendaDetails();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Anotación</Text>
        <TouchableOpacity onPress={handleUpdate}>
          <Icon name="content-save-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Campo Nombre */}
        <TextInput
          style={styles.nameInput}
          value={editableFields.nombre}
          onChangeText={(text) =>
            setEditableFields({ ...editableFields, nombre: text })
          }
          placeholder="Escribe aquí..."
          multiline
        />

        {/* Campo Hora */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => setIsEditingDate(true)}
        >
          <Text style={styles.label}>Hora</Text>
          <Text style={styles.value}>
            {editableFields.hora.toLocaleString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </Text>
        </TouchableOpacity>

        {isEditingDate && (
          <DateTimePicker
            value={editableFields.hora}
            mode="datetime"
            display="default"
            onChange={(event, date) => {
              setIsEditingDate(false);
              if (date) {
                setEditableFields({ ...editableFields, hora: date });
              }
            }}
          />
        )}

        {/* Campo Tipo */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => setShowTypeModal(true)}
        >
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.typeContainer}>
            <View
              style={[
                styles.typeDot,
                { backgroundColor: getTypeColor(editableFields.tipo) },
              ]}
            />
            <Text style={styles.value}>{editableFields.tipo}</Text>
            <Icon name="chevron-right" size={24} color="#000" />
          </View>
        </TouchableOpacity>

        {/* Información */}
        <Text style={styles.infoText}>
          Atención: La información que ingrese aquí es para su propia referencia.
          En caso de emergencia, por favor contacte a su servicio de emergencia
          local.
        </Text>
      </ScrollView>

      {/* Botón Eliminar */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Icon name="trash-can-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Modal Tipo */}
      <AnnotationTypeModal
        modalVisible={showTypeModal}
        setModalVisible={setShowTypeModal}
        selectType={handleSelectType}
      />
    </View>
  );
};

const getTypeColor = (type) => {
  const typeColors = {
    Alergia: '#00ff00',
    Emergencia: '#ff0000',
    Humor: '#708090',
    General: '#008080',
    'Efectos secundarios': '#4682B4',
  };
  return typeColors[type] || '#000';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A9BD3',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 16,
  },
  content: {
    padding: 16,
  },
  nameInput: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginTop: 16,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    padding: 16,
  },
  deleteButton: {
    backgroundColor: '#D9534F',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AgendaDetailScreen;
