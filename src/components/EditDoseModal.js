import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const EditDoseModal = ({ visible, onClose, onSave }) => {
  const [selectedFrequency, setSelectedFrequency] = useState(''); // Frecuencia seleccionada
  const [doses, setDoses] = useState([]); // Dosis dinámicas
  const [isTimePickerVisible, setTimePickerVisible] = useState(false); // Control del TimePicker
  const [activeDoseIndex, setActiveDoseIndex] = useState(null); // Índice activo para el TimePicker

  // Manejar cambio de frecuencia
  const handleFrequencyChange = (frequency) => {
    setSelectedFrequency(frequency);

    // Generar dinámicamente las dosis según la frecuencia seleccionada
    const doseCount = parseInt(frequency, 10);
    const newDoses = Array.from({ length: doseCount }, (_, index) => ({
      id: index,
      hora_dosis: '08:00', // Hora predeterminada
      cantidadP: 1, // Cantidad predeterminada
    }));

    setDoses(newDoses);
  };

  // Guardar hora seleccionada desde el TimePicker
  const handleConfirmTime = (date) => {
    const updatedDoses = [...doses];
    updatedDoses[activeDoseIndex].hora_dosis = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setDoses(updatedDoses);
    setTimePickerVisible(false);
  };

  const renderDoseItem = ({ item, index }) => (
    <View style={styles.doseContainer}>
      <Text style={styles.doseTitle}>Dosis #{index + 1}</Text>

      {/* Botón para seleccionar la hora */}
      <TouchableOpacity
        style={styles.timePicker}
        onPress={() => {
          setActiveDoseIndex(index);
          setTimePickerVisible(true);
        }}
      >
        <Text style={styles.timePickerText}>Tomar a las:</Text>
        <Text style={styles.selectedTime}>{item.hora_dosis}</Text>
      </TouchableOpacity>

      {/* Input para cantidad */}
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
    </View>
  );

  return (
    <View style={styles.container}>
      {visible && (
        <View style={styles.modalContent}>
          <Text style={styles.title}>Configurar Dosis</Text>

          {/* Selección de Frecuencia */}
          <View style={styles.frequencyContainer}>
            <Text style={styles.sectionTitle}>¿Cuántas veces al día?</Text>
            <View style={styles.frequencyOptions}>
              {['1', '2', '3'].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.frequencyButton,
                    selectedFrequency === value && styles.selectedFrequencyButton,
                  ]}
                  onPress={() => handleFrequencyChange(value)}
                >
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      selectedFrequency === value && styles.selectedFrequencyText,
                    ]}
                  >
                    {value} {value === '1' ? 'vez por día' : 'veces por día'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Lista de dosis dinámicas */}
          <FlatList
            data={doses}
            keyExtractor={(item) => `${item.id}`}
            renderItem={renderDoseItem}
            contentContainerStyle={styles.doseList}
          />

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                onSave(doses);
                onClose();
              }}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>

          {/* Time Picker */}
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmTime}
            onCancel={() => setTimePickerVisible(false)}
            is24Hour={true}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  frequencyContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  frequencyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  frequencyButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedFrequencyButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  frequencyButtonText: {
    color: '#000',
  },
  selectedFrequencyText: {
    color: '#fff',
  },
  doseList: {
    marginBottom: 20,
  },
  doseContainer: {
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  doseTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  timePickerText: {
    color: '#000',
  },
  selectedTime: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
  },
});

export default EditDoseModal;
