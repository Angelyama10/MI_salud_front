import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useRoute } from '@react-navigation/native';
import { getMedicamentoDosisById, updateMedicamentoById } from '../services/medicamentos.service';

const EditMedicationScreen = ({ navigation }) => {
  const { control, handleSubmit, setValue } = useForm();
  const route = useRoute();
  const [medicamento, setMedicamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doses, setDoses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedDoses, setEditedDoses] = useState([]);

  const { id, token } = route.params || {};

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !id) {
        Alert.alert('Error', 'Faltan datos necesarios para cargar el medicamento.');
        navigation.goBack();
        return;
      }

      try {
        const data = await getMedicamentoDosisById(token, id);
        console.log('Datos del medicamento obtenidos:', data);

        Object.keys(data).forEach((key) => {
          if (key !== 'dosis') {
            setValue(key, data[key]);
          }
        });
        setDoses(data.dosis || []);
        setMedicamento(data);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la información del medicamento.');
        console.error('Error al obtener medicamento:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, setValue, navigation]);

  const handleUpdate = async (formData) => {
    try {
      setLoading(true);
      const updatedData = { ...formData, dosis: doses };
      await updateMedicamentoById(token, id, updatedData);
      Alert.alert('Éxito', 'Medicamento actualizado correctamente.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el medicamento.');
      console.error('Error al actualizar medicamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDoses = () => {
    setEditedDoses([...doses]);
    setModalVisible(true);
  };

  const handleSaveDoses = (updatedDoses) => {
    setDoses(updatedDoses);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Medicamento</Text>

      <Text>Nombre</Text>
      <Controller
        control={control}
        name="nombre"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text>Unidad</Text>
      <Controller
        control={control}
        name="unidad"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Unidad"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text>Frecuencia</Text>
      <Controller
        control={control}
        name="frecuencia"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Frecuencia"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Text>Unidades Restantes</Text>
      <Controller
        control={control}
        name="unidades_restantes"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Unidades restantes"
            keyboardType="numeric"
            value={value !== undefined ? String(value) : ''}
            onChangeText={(text) => onChange(text ? parseInt(text, 10) : '')}
          />
        )}
      />

      <Text>Unidades Mínimas</Text>
      <Controller
        control={control}
        name="unidades_min"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Unidades mínimas"
            keyboardType="numeric"
            value={value !== undefined ? String(value) : ''}
            onChangeText={(text) => onChange(text ? parseInt(text, 10) : '')}
          />
        )}
      />

      {/* Botón Recordatorios */}
      <TouchableOpacity
        style={styles.recordatoriosButton}
        onPress={handleEditDoses}
      >
        <Text style={styles.recordatoriosText}>
          Recordatorios: {doses.map((d) => `${d.hora_dosis} (Tomar ${d.cantidadP})`).join(', ')}
        </Text>
      </TouchableOpacity>

      {/* Modal para edición de dosis */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Programación</Text>

            <FlatList
              data={editedDoses}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={({ item, index }) => (
                <View style={styles.doseContainer}>
                  <Text style={styles.doseTitle}>Dosis #{index + 1}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Hora de la dosis"
                    value={item.hora_dosis}
                    onChangeText={(text) => {
                      const updatedDoses = [...editedDoses];
                      updatedDoses[index].hora_dosis = text;
                      setEditedDoses(updatedDoses);
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Cantidad"
                    keyboardType="numeric"
                    value={String(item.cantidadP)}
                    onChangeText={(text) => {
                      const updatedDoses = [...editedDoses];
                      updatedDoses[index].cantidadP = parseInt(text, 10) || 0;
                      setEditedDoses(updatedDoses);
                    }}
                  />
                </View>
              )}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleSaveDoses(editedDoses)}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(handleUpdate)}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15 },
  recordatoriosButton: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 5,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  recordatoriosText: { color: '#000', fontWeight: 'bold' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  doseContainer: { marginBottom: 15, width: '100%' },
  doseTitle: { fontWeight: 'bold', marginBottom: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  cancelButton: { backgroundColor: '#ccc', padding: 10, borderRadius: 5, flex: 1, marginRight: 5 },
  cancelButtonText: { color: '#000' },
  saveButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, flex: 1 },
  saveButtonText: { color: '#fff' },
});

export default EditMedicationScreen;
