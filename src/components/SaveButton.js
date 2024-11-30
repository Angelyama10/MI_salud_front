import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SaveButton = ({ buttonText, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]} // Cambia el estilo si está deshabilitado
      onPress={onPress}
      disabled={disabled} // Botón deshabilitado
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#B5D6FD',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC', // Color cuando está deshabilitado
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SaveButton;
