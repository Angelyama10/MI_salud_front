import React, { useState, useContext } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MedicationOption from '../components/MedicationOption';
import SaveButton from '../components/SaveButton';
import { postMedicamentos } from '../services/medicamentos.service';
import { TokenContext } from '../context/TokenContext'; // Importa el contexto

const { width, height } = Dimensions.get('window');

const AdditionalForm = ({ navigation }) => {
  const route = useRoute();
  const medicamentoNombre = route.params?.medicamentoNombre || 'Medicamento, 300mg';
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { token, setMedicamentos } = useContext(TokenContext); // Contexto del token y medicamentos

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return token;
    } catch (error) {
      console.error('Error obteniendo el token:', error);
    }
  };

  const determinarAccion = (unidad) => {
    const acciones = {
      tabletas: 'Tomar',
      pastillas: 'Tomar',
      ampollas: 'Aplicar',
      aerosol: 'Aplicar',
      pomada: 'Aplicar',
      crema: 'Aplicar',
    };
    return acciones[unidad.toLowerCase()] || 'Usar';
  };

  const obtenerIcono = (unidad) => {
    const iconos = {
      tabletas: 'pill',
      pastillas: 'pill',
      ampollas: 'needle',
      aerosol: 'spray',
      pomada: 'tube',
      crema: 'tube',
      jarabe: 'bottle-tonic',
      gotas: 'water',
    };
    return iconos[unidad.toLowerCase()] || 'pill';
  };

  const handleSave = async () => {
    try {
      setIsButtonDisabled(true);
    
      const storedData = await AsyncStorage.getItem('selectedMedicamentos');
      const allMedicamentos = storedData ? JSON.parse(storedData) : [];
      const dataMed = allMedicamentos.find(med => med.nombre === medicamentoNombre);

      if (!dataMed) throw new Error('No se encontraron datos para este medicamento.');
      if (!Array.isArray(dataMed.dosis) || dataMed.dosis.length === 0) {
        throw new Error('No hay dosis guardadas para este medicamento.');
      }

      console.log("Datos completos que se enviarán a la API:", JSON.stringify(dataMed, null, 2));
      const nuevoMedicamento = await postMedicamentos(token, dataMed);

      setMedicamentos((prevMedicamentos) => [
        ...prevMedicamentos,
        ...nuevoMedicamento.dosis.map((dosis) => ({
          id: nuevoMedicamento.id,
          nombre: nuevoMedicamento.nombre,
          hora: dosis.hora_dosis,
          dosis: `${determinarAccion(nuevoMedicamento.unidad)} ${dosis.cantidadP} ${nuevoMedicamento.unidad}`,
          icon: obtenerIcono(nuevoMedicamento.unidad),
        })),
      ]);

      Alert.alert('Éxito', 'Datos enviados correctamente.');
      await AsyncStorage.clear();
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message || 'Hubo un problema al enviar los datos.');
      console.error('Error al enviar datos:', error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>{medicamentoNombre}</Text>
        </View>
      </View>

      <View style={styles.lowerSection}>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <Text style={styles.instructionText}>Ya casi terminamos. Por favor complete estos datos :</Text>

         
          <MedicationOption
            iconName="alarm"
            optionText="Establecer recordatorio de recarga"
            onPress={() => navigation.navigate('RefillingMedications', { medicamentoNombre })}
          />
          <MedicationOption
            iconName="document-text"
            optionText="Agregar instrucciones"
            onPress={() => navigation.navigate('MedicationInstructions', { medicamentoNombre })}
          />

          <SaveButton
            buttonText="Guardar"
            onPress={handleSave}
            disabled={isButtonDisabled}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B5D6FD',
  },
  upperSection: {
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
    flexShrink: 1,
  },
  imageTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: height * 0.025,
  },
  image: {
    width: width * 0.2,
    height: width * 0.2,
    resizeMode: 'contain',
    marginBottom: height * 0.015,
  },
  lowerSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: '5%',
    paddingTop: height * 0.03,
    paddingBottom: height * 0.02,
  },
  instructionText: {
    fontSize: width * 0.045,
    color: '#6D6D6D',
    textAlign: 'center',
    marginBottom: height * 0.025,
  },
});

export default AdditionalForm;
