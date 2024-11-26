import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import PildorasImage from '../../assets/images/pildoras.png';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const PresentationScreen = ({ navigation }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('Pastillas');
  const [items, setItems] = useState([
    { label: 'Pastillas', value: 'Pastillas' },
    { label: 'Jarabe', value: 'Jarabe' },
    { label: 'Ampolla', value: 'Ampolla' },
  ]);

  const route = useRoute();
  const medicamentoNombre = route.params?.medicamentoNombre || 'Medicamento';

  // Limpieza de AsyncStorage al salir de la pantalla
  useFocusEffect(
    useCallback(() => {
      console.log('PresentationScreen montada');
      return () => {
        AsyncStorage.removeItem('selectedMedicamentos')
          .then(() => console.log('AsyncStorage limpiado al salir de PresentationScreen'))
          .catch((error) => console.error('Error al limpiar AsyncStorage:', error));
      };
    }, [])
  );

  useEffect(() => {
    // Inicializar el medicamento solo una vez al montar el componente
    const initializeMedicamento = async () => {
      try {
        const storedData = await AsyncStorage.getItem('selectedMedicamentos');
        const parsedData = storedData ? JSON.parse(storedData) : [];

        // Crear un medicamento inicial
        const medicamentoConPresentacion = {
          nombre: medicamentoNombre,
          presentacion: value, // Toma la presentación seleccionada
          dosis: [],           // Inicializa el array vacío
          numero_dosis: 0,     // Número de dosis inicial
          frecuencia: '',      // Frecuencia inicial
        };

        // Evitar duplicados
        const updatedData = parsedData.filter(
          (med) => !(med.nombre === medicamentoNombre && med.presentacion === value)
        );
        updatedData.push(medicamentoConPresentacion);

        await AsyncStorage.setItem('selectedMedicamentos', JSON.stringify(updatedData));
        console.log('Medicamento inicializado en AsyncStorage:', medicamentoConPresentacion);
      } catch (error) {
        console.error('Error al inicializar el medicamento:', error);
      }
    };

    initializeMedicamento();
  }, [medicamentoNombre, value]); // Dependencias correctas

  const handleSaveAndNavigate = async () => {
    try {
      const storedData = await AsyncStorage.getItem('selectedMedicamentos');
      const parsedData = storedData ? JSON.parse(storedData) : [];

      const medicamentoConPresentacion = {
        nombre: medicamentoNombre,
        presentacion: value,
        dosis: [],
        numero_dosis: 0,
        frecuencia: '',
      };

      const updatedData = parsedData.filter(
        (med) => !(med.nombre === medicamentoConPresentacion.nombre && med.presentacion === value)
      );
      updatedData.push(medicamentoConPresentacion);

      await AsyncStorage.setItem('selectedMedicamentos', JSON.stringify(updatedData));
      console.log('Medicamento actualizado con presentación:', medicamentoConPresentacion);

      navigation.navigate('MedicationScreen', { medicamentoNombre });
    } catch (error) {
      console.error('Error guardando el medicamento:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.upperSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Icon name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.title}>{medicamentoNombre}</Text>
        </View>
        <View style={styles.imageTextContainer}>
          <Image source={PildorasImage} style={styles.image} />
          <Text style={styles.questionText}>¿En qué presentación viene el medicamento?</Text>
        </View>
      </View>
      <View style={styles.lowerSection}>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={styles.dropdownContainer}>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownMenu}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSaveAndNavigate}>
            <Text style={styles.buttonText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  upperSection: {
    width: '100%',
    height: '40%',
    backgroundColor: '#B5D6FD',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: '5%',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 15,
  },
  imageTextContainer: {
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  lowerSection: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 10,
  },
  dropdownMenu: {
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PresentationScreen;
