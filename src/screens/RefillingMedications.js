import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import medicamentos from '../../assets/mockData/medicamentos.json';

const { width, height } = Dimensions.get('window');

const RefillingMedications = ({ navigation }) => {
  const route = useRoute();
  const medicamentoNombre = route.params?.medicamentoNombre || 'Medicamento, 300mg';

  const medicamento = medicamentos.find((med) => med.nombre === medicamentoNombre);

  const [existencia, setExistencia] = useState(
    medicamento ? medicamento.total_unidades.toString() : ''
  );
  const [limite, setLimite] = useState('5');

  useEffect(() => {
    if (medicamento) {
      setExistencia(medicamento.total_unidades.toString());
    }
  }, [medicamento]);

  const handleSave = async () => {
    try {
      const storedData = await AsyncStorage.getItem('selectedMedicamentos');
      const parsedData = storedData ? JSON.parse(storedData) : [];

      const updatedData = parsedData.map((med) => {
        if (med.nombre === medicamentoNombre) {
          return {
            ...med,
            unidades_restantes: parseInt(existencia, 10),
            unidades_min: parseInt(limite, 10),
          };
        }
        return med;
      });

      await AsyncStorage.setItem('selectedMedicamentos', JSON.stringify(updatedData));
      navigation.navigate('AdditionalForm', { medicamentoNombre });
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.upperSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={width * 0.06} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>{medicamentoNombre}</Text>
        </View>
        <View style={styles.imageTextContainer}>
          <Icon name="medkit" size={width * 0.2} color="white" />
          <Text style={styles.instructionText}>
            ¿Cuántas medicinas quieres que queden antes de recibir un recordatorio de recarga?
          </Text>
        </View>
      </View>

      {/* Form */}
      <View style={styles.lowerSection}>
        <View style={styles.row}>
          <Text style={styles.label}>Existencia</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={existencia}
            onChangeText={setExistencia}
            placeholder="10"
          />
          <Text style={styles.subText}>Quedan pastilla(s)</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Límite</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={limite}
            onChangeText={setLimite}
            placeholder="5"
          />
          <Text style={styles.subText}>Quedan pastilla(s)</Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B5D6FD', // Light blue background
  },
  upperSection: {
    backgroundColor: '#B5D6FD',
    paddingBottom: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
  },
  title: {
    fontSize: width * 0.05,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 15,
    flexShrink: 1,
  },
  imageTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
  instructionText: {
    fontSize: width * 0.045,
    color: '#FFFFFF',
    marginTop: 10,
    textAlign: 'center',
  },
  lowerSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: height * 0.03,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.03,
  },
  label: {
    fontSize: width * 0.045,
    color: '#333',
    flex: 1,
  },
  input: {
    width: width * 0.35, // Increased width
    height: height * 0.06, // Slightly taller
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: width * 0.045,
    color: '#333',
    backgroundColor: '#F7F9FC', // Light background for input fields
  },
  subText: {
    fontSize: width * 0.04,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  saveButton: {
    backgroundColor: '#B5D6FD', // Match button color to other screens
    borderRadius: 25,
    paddingVertical: 15,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 20, // Space from the bottom
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default RefillingMedications;
