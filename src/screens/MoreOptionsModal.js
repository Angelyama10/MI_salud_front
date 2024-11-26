import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

const MoreOptionsModal = ({ visible, onClose, navigation }) => {
  const options = [
    { text: 'Agenda', iconName: 'calendar', navigateTo: 'AnotacionScreen' },
    { text: 'Cita', iconName: 'calendar-check', navigateTo: 'MedicalAppointmentsScreen' },
    { text: 'Médicos', iconName: 'doctor', navigateTo: 'DoctorsScreen' },
    { text: 'Configuración', iconName: 'cog', navigateTo: 'SettingsScreen' },
    { text: 'Agregar Medicamento', iconName: 'pill', navigateTo: 'Search' }, // Reemplazado por "pill"
  ];
 

  const handleOptionPress = (navigateTo) => {
    onClose(); // Cierra el modal
    navigation.navigate(navigateTo); // Navega a la pantalla correspondiente
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleOptionPress(option.navigateTo)}
          >
            <Text style={styles.optionText}>{option.text}</Text>
            <Icon name={option.iconName} size={24} color="#5A9BD3" />
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end', // Posiciona el modal al fondo de la pantalla
    margin: 0, // Elimina los márgenes predeterminados
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '80%', // Reduce el ancho del modal
    borderTopLeftRadius: 20, // Redondea la esquina superior izquierda
    borderBottomLeftRadius: 20, // Redondea la esquina inferior izquierda
    paddingVertical: 20,
    paddingHorizontal: 15,
    // Añade sombras para darle profundidad
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Para Android
    alignSelf: 'flex-end',
    marginRight: 0, // Alinea el modal a la derecha
    marginBottom: 0,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 18,
    color: '#333333',
    flex: 1,
    marginRight: 10, // Espacio entre el texto y el ícono
  },
});

export default MoreOptionsModal;
