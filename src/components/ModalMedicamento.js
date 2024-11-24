import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { TokenContext } from '../context/TokenContext';
import { deleteMedicamentoById } from '../services/medicamentos.service';
import ConfirmationModal from './ConfirmationModal'; // Modal de confirmación

const { width } = Dimensions.get('window');

const ModalMedicamento = ({ visible, onClose, id, nombre, hora, unidad, cantidad = 0, momentoComida, icono }) => {
  const navigation = useNavigation();
  const { token, setMedicamentos } = useContext(TokenContext); // Contexto global
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);

  const handleEdit = () => {
    if (!token || token.length < 20) {
      Alert.alert('Error', 'Token no disponible o inválido. Por favor, inicia sesión nuevamente.');
      console.error('Token no disponible:', token);
      return;
    }
  
    if (!id) {
      Alert.alert('Error', 'El ID del medicamento no está definido.');
      console.error('ID del medicamento no está definido');
      return;
    }
  
    navigation.navigate('EditMedicationScreen', { id, token });
    onClose();
  };
  

  const handleDelete = async () => {
    try {
      setActionInProgress(true);
      await deleteMedicamentoById(token, id);
      setMedicamentos((prevMedicamentos) =>
        prevMedicamentos.filter((medicamento) => medicamento.id !== id)
      );
      Alert.alert('Éxito', `El medicamento "${nombre}" ha sido eliminado.`);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el medicamento. Inténtalo nuevamente.');
      console.error('Error al eliminar medicamento:', error);
    } finally {
      setActionInProgress(false);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Icon name={icono} size={48} color="#5A9BD3" />
                <Text style={styles.medicamentoNombre}>{nombre}</Text>
              </View>
              <View style={styles.actionIcons}>
                <TouchableOpacity
                  onPress={() => setConfirmationVisible(true)}
                  disabled={actionInProgress}
                >
                  <Icon name="trash-can-outline" size={24} color={actionInProgress ? '#999999' : '#333333'} />
                </TouchableOpacity>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <Icon name="identifier" size={24} color="#5A9BD3" style={styles.infoIcon} />
                  <Text style={styles.infoText}>ID: {id}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Icon name="calendar-clock" size={24} color="#5A9BD3" style={styles.infoIcon} />
                  <Text style={styles.infoText}>Agendado para {hora}, hoy</Text>
                </View>
                <View style={styles.infoItem}>
                  <Icon name="pill" size={24} color="#5A9BD3" style={styles.infoIcon} />
                  <Text style={styles.infoText}>
                    {`Tomar ${cantidad} ${unidad}${momentoComida ? ` (${momentoComida})` : ''}`}
                  </Text>
                </View>
              </View>

              {/* Botón central */}
              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Icon name="pencil-outline" size={32} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      {/* Modal de Confirmación */}
      <ConfirmationModal
        visible={confirmationVisible}
        title="Eliminar Medicamento"
        message={`¿Estás seguro de que deseas eliminar el medicamento "${nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmationVisible(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  medicamentoNombre: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 10,
  },
  actionIcons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 15,
    right: 15,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333333',
  },
  editButton: {
    backgroundColor: '#5A9BD3', // Azulito
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default ModalMedicamento;
