import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Dimensions, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimePickerModal } from 'react-native-paper-dates';

const { width, height } = Dimensions.get('window');

const UnaVezAlDiaScreen = ({ navigation }) => {
  const route = useRoute();
  const { medicamentoNombre } = route.params;
  const [visible, setVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [doseAmount, setDoseAmount] = useState("1");
  const [selectedMoment, setSelectedMoment] = useState("antes");

  const onConfirm = ({ hours, minutes }) => {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const adjustedHour = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    setSelectedTime(`${adjustedHour}:${formattedMinutes} ${ampm}`);
    setVisible(false);
  };

  const handleSaveTime = async () => {
    try {
      const storedData = await AsyncStorage.getItem('selectedMedicamentos');
      const parsedData = storedData ? JSON.parse(storedData) : [];

      const updatedData = parsedData.map((medicamento) => {
        if (medicamento.nombre === medicamentoNombre) {
          const existingDoses = Array.isArray(medicamento.dosis) ? medicamento.dosis : [];
          const updatedDoses = existingDoses.filter((dosis) => dosis.numero_dosis !== 1);
          updatedDoses.push({
            numero_dosis: 1,
            hora_dosis: selectedTime,
            cantidadP: parseInt(doseAmount, 10),
            momento_comida: selectedMoment,
            suministrada: false,
          });

          return {
            ...medicamento,
            numero_dosis: updatedDoses.length,
            dosis: updatedDoses,
          };
        }
        return medicamento;
      });

      await AsyncStorage.setItem('selectedMedicamentos', JSON.stringify(updatedData));
      console.log('Dosis actualizada en AsyncStorage:', updatedData);
    } catch (error) {
      console.error('Error guardando la información de la dosis:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#B5D6FD" barStyle="light-content" />
      <View style={styles.topContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>{medicamentoNombre}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="alarm" size={width * 0.2} color="white" />
          <Text style={styles.questionText}>¿Cuándo la dosis?</Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.doseContainer}>
          <Text style={styles.doseLabel}>Tomar</Text>
          <TextInput
            style={styles.doseInput}
            value={doseAmount}
            keyboardType="numeric"
            onChangeText={(text) => setDoseAmount(text)}
          />
          <Text style={styles.doseLabel}>pastilla(s)</Text>
        </View>

        <TouchableOpacity style={styles.timePicker} onPress={() => setVisible(true)}>
          <Text style={styles.timePickerText}>Tomar a las</Text>
          <Text style={styles.selectedTime}>{selectedTime}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            await handleSaveTime();
            navigation.navigate('AdditionalForm', { medicamentoNombre });
          }}
        >
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>

        <TimePickerModal
          visible={visible}
          onDismiss={() => setVisible(false)}
          onConfirm={onConfirm}
          hours={10}
          minutes={0}
          label="Selecciona la hora"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B5D6FD',
  },
  topContainer: {
    backgroundColor: '#B5D6FD',
    paddingBottom: height * 0.05,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingTop: height * 0.02,
    paddingBottom: height * 0.015,
  },
  title: {
    fontSize: width * 0.06,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: width * 0.03,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.02,
  },
  questionText: {
    fontSize: width * 0.045,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: height * 0.01,
    paddingHorizontal: '10%',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: height * 0.03,
    paddingHorizontal: '5%',
    paddingBottom: height * 0.02,
  },
  doseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: height * 0.02,
    borderRadius: 10,
    marginBottom: height * 0.02,
  },
  doseLabel: {
    fontSize: width * 0.045,
    color: '#000',
  },
  doseInput: {
    fontSize: width * 0.045,
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#1E90FF',
    marginHorizontal: 5,
    width: 40,
    textAlign: 'center',
  },
  timePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: height * 0.02,
    borderRadius: 10,
    marginTop: height * 0.02,
  },
  timePickerText: {
    fontSize: width * 0.045,
    color: '#000',
  },
  selectedTime: {
    fontSize: width * 0.045,
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#B5D6FD',
    paddingVertical: height * 0.02,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});

export default UnaVezAlDiaScreen;
