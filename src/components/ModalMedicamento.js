import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { TokenContext } from '../context/TokenContext';
import {
  fetchMedicamentoConDosisById,
  updateMedicamentoById,
  deleteMedicamentoById,
} from '../services/medicamentos.service';

const { width } = Dimensions.get('window');

const ModalMedicamento = ({
  visible,
  onClose,
  id,
  nombre,
  hora,
  unidad = 'unidad',
  cantidad = 0,
  momentoComida = '',
  icono,
}) => {
  const navigation = useNavigation();
  const { token, setMedicamentos } = useContext(TokenContext);

  // Estados inicializados
  const [medicamento, setMedicamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);

  // Efecto para cargar datos
  useEffect(() => {
    const fetchData = async () => {
      if (!token || !id) return;

      setLoading(true);
      try {
        const data = await fetchMedicamentoConDosisById(token, id);
        setMedicamento(data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        Alert.alert('Error', 'No se pudo cargar la información del medicamento.');
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchData();
    }
  }, [visible, token, id]);

  // Lógica para los botones
  const handleTomar = async () => {
    if (!medicamento) return;

    try {
      setActionInProgress(true);
      const updatedData = {
        ...medicamento,
        dosis: medicamento.dosis.map((dose) =>
          dose.hora_dosis === hora ? { ...dose, suministrada: true } : dose
        ),
      };

      await updateMedicamentoById(token, id, updatedData);
      setMedicamento(updatedData);
      Alert.alert('Éxito', 'La dosis fue marcada como tomada.');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo marcar la dosis como tomada.');
      console.error(error);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleEdit = () => {
    if (!token || token.length < 20) {
      Alert.alert('Error', 'Token no disponible o inválido. Por favor, inicia sesión nuevamente.');
      return;
    }

    if (!id) {
      Alert.alert('Error', 'El ID del medicamento no está definido.');
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

  if (!visible) return null;

  if (loading) {
    return (
      <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text>Cargando medicamento...</Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Botones superiores para Editar y Eliminar */}
              <View style={styles.topRightButtons}>
                <TouchableOpacity onPress={handleDelete} disabled={actionInProgress}>
                  <Icon name="trash-can-outline" size={24} color="#9E9E9E" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEdit} disabled={actionInProgress}>
                  <Icon name="pencil-outline" size={24} color="#9E9E9E" />
                </TouchableOpacity>
              </View>

              {/* Encabezado con icono y nombre del medicamento */}
              <View style={styles.header}>
                <Icon name={icono || 'pill'} size={48} color="#4D88FF" />
                <Text style={styles.medicamentoNombre}>{nombre}</Text>
              </View>

              {/* Información del medicamento */}
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Icon name="calendar-clock" size={20} color="#4D88FF" />
                  <Text style={styles.infoText}>Agendado para {hora}, hoy</Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="pill" size={20} color="#4D88FF" />
                  <Text style={styles.infoText}>
                    Tomar {cantidad} {unidad}(s)
                  </Text>
                </View>
              </View>

              {/* Botón de Tomar */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleTomar}
                disabled={actionInProgress}
              >
                <Icon name="check-circle-outline" size={32} color="#fff" />
                <Text style={styles.actionButtonText}>Tomar</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: width * 0.9,
    alignItems: 'center',
  },
  topRightButtons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 15,
    right: 15,
    gap: 15,
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
  },
  medicamentoNombre: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginTop: 10,
  },
  infoContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4D88FF',
    borderRadius: 25,
    width: 150,
    height: 50,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default ModalMedicamento;
