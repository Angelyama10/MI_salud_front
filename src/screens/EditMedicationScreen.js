import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useRoute } from '@react-navigation/native';
import { TokenContext } from '../context/TokenContext';
import { getMedicamentoDosisById, updateMedicamentoById } from '../services/medicamentos.service';

const EditMedicationScreen = ({ navigation }) => {
  const { control, handleSubmit, setValue } = useForm();
  const route = useRoute();
  const { id } = route.params || {};
  const { token } = useContext(TokenContext);
  const [medicamento, setMedicamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doses, setDoses] = useState([]);

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
  
      // Construir los datos actualizados
      const updatedData = {
        ...formData,
        numero_dosis: doses.length, // Número de dosis total (frecuencia)
        dosis: doses.map((dose, index) => ({
          ...dose,
          numero_dosis: index + 1, // Actualiza el número de cada dosis
        })),
      };
  
      console.log('Datos enviados al servidor:', JSON.stringify(updatedData, null, 2));
  
      // Validar datos antes de enviar
      if (!updatedData.nombre || !updatedData.unidad) {
        throw new Error('El nombre y la unidad son campos obligatorios.');
      }
  
      // Llamar a la API para actualizar los datos
      const response = await updateMedicamentoById(token, id, updatedData);
  
      console.log('Respuesta del servidor:', JSON.stringify(response, null, 2));
  
      Alert.alert('Éxito', 'Medicamento actualizado correctamente.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el medicamento. Revisa los datos.');
      console.error('Error al actualizar medicamento:', error.message);
    } finally {
      setLoading(false);
    }
  };  

  const handleEditDoses = () => {
    navigation.navigate('EditDosesScreen', {
      medicationId: id,
      initialDoses: doses,
      initialFrequency: `${doses.length} veces al día`, // Pasa la frecuencia inicial
      onSave: ({ doses: updatedDoses, frequency }) => {
        setDoses(updatedDoses);
        setValue('frecuencia', frequency); // Actualiza la frecuencia en el formulario
      },
      token,
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
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
      <TouchableOpacity style={styles.recordatoriosButton} onPress={handleEditDoses}>
        <Text style={styles.recordatoriosText}>
          Recordatorios: {doses.map((d) => `${d.hora_dosis} (Tomar ${d.cantidadP})`).join(', ')}
        </Text>
      </TouchableOpacity>

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
