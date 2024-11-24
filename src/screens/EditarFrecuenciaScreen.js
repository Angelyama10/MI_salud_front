import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { updateMedicamentoById } from '../services/medicamentosService';

const EditarFrecuenciaScreen = ({ route, navigation }) => {
  const { medicamento, token } = route.params;
  const [frecuencia, setFrecuencia] = useState(medicamento.frecuencia);
  const [dosis, setDosis] = useState(medicamento.dosis);

  const handleUpdate = async () => {
    const updatedData = { ...medicamento, frecuencia, dosis };

    try {
      await updateMedicamentoById(token, medicamento.id, updatedData);
      Alert.alert('Éxito', 'Medicamento actualizado correctamente.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el medicamento.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Frecuencia</Text>
      <TextInput
        style={styles.input}
        value={frecuencia}
        onChangeText={setFrecuencia}
        placeholder="Frecuencia (e.g., Diaria, Semanal)"
      />
      <FlatList
        data={dosis}
        renderItem={({ item, index }) => (
          <View style={styles.dosisRow}>
            <Text>Dosis {index + 1}:</Text>
            <TextInput
              style={styles.input}
              value={item.hora_dosis}
              onChangeText={(text) => {
                const newDosis = [...dosis];
                newDosis[index].hora_dosis = text;
                setDosis(newDosis);
              }}
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  dosisRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  dosisText: { fontSize: 16, marginRight: 10 },
});

export default EditarFrecuenciaScreen;
