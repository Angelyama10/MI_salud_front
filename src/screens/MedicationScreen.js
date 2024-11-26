import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, SafeAreaView, StatusBar, StyleSheet, Text, Dimensions } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MedicationHeader from '../components/MedicationHeader';
import MedicationOption from '../components/MedicationOption';

const { height } = Dimensions.get('window');

const MedicationScreen = ({ navigation }) => {
  const route = useRoute();
  const { medicamentoNombre } = route.params;
  const [storedMedicamentos, setStoredMedicamentos] = useState([]);

  // Cargar medicamentos desde AsyncStorage al montar
  useEffect(() => {
    const loadStoredMedicamentos = async () => {
      try {
        const storedData = await AsyncStorage.getItem('selectedMedicamentos');
        setStoredMedicamentos(storedData ? JSON.parse(storedData) : []);
      } catch (error) {
        console.error('Error cargando medicamentos:', error);
      }
    };
    loadStoredMedicamentos();
  }, []);

  // Limpiar AsyncStorage al salir de la pantalla
  useFocusEffect(
    useCallback(() => {
      const clearAsyncStorage = async () => {
        try {
          await AsyncStorage.removeItem('selectedMedicamentos');
          console.log('AsyncStorage limpiado al salir de MedicationScreen.');
        } catch (error) {
          console.error('Error limpiando AsyncStorage:', error);
        }
      };

      return () => {
        clearAsyncStorage();
      };
    }, [])
  );

  // Guardar configuración de frecuencia y dosis
  const handleSaveFrequencyAndDoses = async (numeroDosis, frecuencia, doses) => {
    try {
      const storedData = await AsyncStorage.getItem('selectedMedicamentos');
      const parsedData = storedData ? JSON.parse(storedData) : [];

      const updatedData = parsedData.map((medicamento) => {
        if (medicamento.nombre === medicamentoNombre) {
          // Generar IDs únicos para cada dosis
          const dosesWithIds = doses.map((dosis, index) => ({
            ...dosis,
            id: medicamento.dosis?.length + index + 1 || index + 1, // ID incremental basado en dosis existentes
          }));

          return {
            ...medicamento,
            frecuencia, // Actualizamos la frecuencia
            numero_dosis: numeroDosis,
            total_unidades: medicamento.total_unidades || 500, // Valor inicial o mantenemos el existente
            unidades_restantes: medicamento.unidades_restantes || 500, // Valor inicial o mantenemos el existente
            unidades_min: medicamento.unidades_min || 8, // Valor inicial
            dosis: [...(medicamento.dosis || []), ...dosesWithIds], // Combinamos las dosis existentes con las nuevas
          };
        }
        return medicamento;
      });

      await AsyncStorage.setItem('selectedMedicamentos', JSON.stringify(updatedData));
      console.log('Frecuencia y dosis actualizadas en AsyncStorage:', updatedData);
    } catch (error) {
      console.error('Error guardando frecuencia y dosis:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#B5D6FD" barStyle="light-content" />

      <MedicationHeader
        navigation={navigation}
        title={medicamentoNombre}
        iconName="calendar"
        questionText="¿Con qué frecuencia toma este medicamento?"
      />

      <View style={styles.lowerSection}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <MedicationOption
            optionText="Una vez al día"
            onPress={() => {
              handleSaveFrequencyAndDoses(1, 'Diaria', [
                {
                  numero_dosis: 1,
                  hora_dosis: '08:00',
                  momento_comida: 'antes',
                  cantidadP: 1,
                  suministrada: false,
                },
              ]);
              navigation.navigate('UnaVezAlDiaScreen', { medicamentoNombre });
            }}
          />
          <MedicationOption
            optionText="Dos veces al día"
            onPress={() => {
              handleSaveFrequencyAndDoses(2, 'Diaria', [
                {
                  numero_dosis: 1,
                  hora_dosis: '08:00',
                  momento_comida: 'antes',
                  cantidadP: 1,
                  suministrada: false,
                },
                {
                  numero_dosis: 2,
                  hora_dosis: '20:00',
                  momento_comida: 'después',
                  cantidadP: 1,
                  suministrada: false,
                },
              ]);
              navigation.navigate('TwiceaDay', { medicamentoNombre });
            }}
          />
          <MedicationOption
            optionText="Tres veces al día"
            onPress={() => {
              handleSaveFrequencyAndDoses(3, 'Diaria', [
                {
                  numero_dosis: 1,
                  hora_dosis: '08:00',
                  momento_comida: 'antes',
                  cantidadP: 2,
                  suministrada: false,
                },
                {
                  numero_dosis: 2,
                  hora_dosis: '14:00',
                  momento_comida: 'durante',
                  cantidadP: 1,
                  suministrada: false,
                },
                {
                  numero_dosis: 3,
                  hora_dosis: '20:00',
                  momento_comida: 'después',
                  cantidadP: 1,
                  suministrada: false,
                },
              ]);
              navigation.navigate('ThreeTimesADay', { medicamentoNombre });
            }}
          />
          <MedicationOption
            optionText="Según sea necesario (sin recordatorio)"
            onPress={() => {
              handleSaveFrequencyAndDoses(0, 'Según sea necesario', []);
              navigation.navigate('ScreenAsNeeded', { medicamentoNombre });
            }}
          />
          <MedicationOption
            optionText="Otro"
            onPress={() => {
              navigation.navigate('MedicationProgram', { medicamentoNombre });
            }}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B5D6FD',
  },
  lowerSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: height * 0.03,
    paddingHorizontal: '5%',
    paddingBottom: height * 0.02,
  },
  scrollContent: {
    paddingBottom: height * 0.05,
  },
});

export default MedicationScreen;
