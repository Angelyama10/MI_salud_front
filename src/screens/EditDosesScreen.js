import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Button,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { getDosesByMedicationId } from '../services/medicamentos.service';

const EditDosesScreen = ({ navigation, route }) => {
  const { medicationId, initialDoses = [], onSave, token, initialFrequency } = route.params;

  const [doses, setDoses] = useState(initialDoses);
  const [frequency, setFrequency] = useState(initialFrequency || `${doses.length} veces al día`);
  const [showFrequencySelector, setShowFrequencySelector] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDoseIndex, setSelectedDoseIndex] = useState(null);

  useEffect(() => {
    const fetchDoses = async () => {
      try {
        const fetchedDoses = await getDosesByMedicationId(token, medicationId);
        setDoses(fetchedDoses);
        setFrequency(`${fetchedDoses.length} veces al día`);
      } catch (error) {
        console.error('Error al cargar las dosis:', error);
      }
    };

    if (!initialDoses || initialDoses.length === 0) {
      fetchDoses();
    }
  }, [medicationId, token, initialDoses]);

  const handleFrequencyChange = (selectedFrequency) => {
    setFrequency(selectedFrequency);
    setShowFrequencySelector(false);

    const frequencyCount = parseInt(selectedFrequency.split(' ')[0], 10);
    const updatedDoses = [...doses];

    while (updatedDoses.length < frequencyCount) {
      updatedDoses.push({
        numero_dosis: updatedDoses.length + 1,
        hora_dosis: '',
        cantidadP: 0,
        momento_comida: 'antes',
        suministrada: false,
      });
    }
    while (updatedDoses.length > frequencyCount) {
      updatedDoses.pop();
    }

    setDoses(updatedDoses);
  };

  const handleShowTimePicker = (index) => {
    setSelectedDoseIndex(index);
    setShowTimePicker(true);
  };

  const handleTimeChange = (event, selectedDate) => {
    setShowTimePicker(false);
    if (!selectedDate || selectedDoseIndex === null) return;

    const updatedDoses = [...doses];
    const formattedTime = `${selectedDate.getHours()}:${selectedDate.getMinutes().toString().padStart(2, '0')}`;
    updatedDoses[selectedDoseIndex].hora_dosis = formattedTime;
    setDoses(updatedDoses);
  };

  const handleSave = () => {
    const cleanedDoses = doses.map((dose, index) => ({
      ...dose,
      numero_dosis: index + 1,
    }));

    console.log('Dosis procesadas antes de enviar:', cleanedDoses);

    if (typeof onSave === 'function') {
      onSave({ doses: cleanedDoses, frequency });
    } else {
      console.error('onSave no está definido en los parámetros de la ruta');
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Programación</Text>

      <View style={styles.frequencyContainer}>
        <Text style={styles.label}>¿Cuántas veces al día?</Text>
        <TouchableOpacity
          style={styles.frequencyButton}
          onPress={() => setShowFrequencySelector(true)}
        >
          <Text style={styles.frequencyText}>{frequency}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showFrequencySelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFrequencySelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Frecuencia</Text>
            {['1 vez al día', '2 veces al día', '3 veces al día'].map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleFrequencyChange(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Cerrar" onPress={() => setShowFrequencySelector(false)} />
          </View>
        </View>
      </Modal>

      <FlatList
        data={doses}
        keyExtractor={(item, index) => `dose-${index}`}
        renderItem={({ item, index }) => (
          <View style={styles.doseContainer}>
            <Text style={styles.doseTitle}>Dosis #{index + 1}</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => handleShowTimePicker(index)}
            >
              <Text style={styles.timeText}>{item.hora_dosis || 'Seleccionar hora'}</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Cantidad"
              keyboardType="numeric"
              value={String(item.cantidadP)}
              onChangeText={(text) => {
                const updatedDoses = [...doses];
                updatedDoses[index].cantidadP = parseInt(text, 10) || 0;
                setDoses(updatedDoses);
              }}
            />
            <Picker
              selectedValue={item.momento_comida}
              onValueChange={(value) => {
                const updatedDoses = [...doses];
                updatedDoses[index].momento_comida = value;
                setDoses(updatedDoses);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Antes de comer" value="antes" />
              <Picker.Item label="Durante la comida" value="durante" />
              <Picker.Item label="Después de comer" value="después" />
            </Picker>
          </View>
        )}
      />

      <View style={styles.buttonContainer}>
        <Button title="Guardar" onPress={handleSave} />
        <Button title="Cancelar" color="red" onPress={() => navigation.goBack()} />
      </View>

      {showTimePicker && (
        <DateTimePicker
          mode="time"
          display="default"
          value={new Date()}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  frequencyContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  frequencyButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  frequencyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  doseContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  doseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeButton: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  timeText: {
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
});

export default EditDosesScreen;
