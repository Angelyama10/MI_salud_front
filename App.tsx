import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TokenProvider } from './src/context/TokenContext'; // Contexto para el manejo de tokens

// Importa tus pantallas
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import NuevoUsuario from './src/screens/NuevoUsuario';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import PresentationScreen from './src/screens/PresentationScreen';
import MedicationScreen from './src/screens/MedicationScreen';
import UnaVezAlDiaScreen from './src/screens/UnaVezAlDiaScreen';
import AdditionalForm from './src/screens/AdditionalForm';
import TreatmentDuration from './src/screens/TreatmentDuration';
import DurationOfTreatment2 from './src/screens/DurationOfTreatment2';
import RefillingMedications from './src/screens/RefillingMedications';
import MedicationInstructions from './src/screens/MedicationInstructions';
import TwiceaDay from './src/screens/TwiceaDay';
import ThreeTimesADay from './src/screens/ThreeTimesADay';
import MedicationProgram from './src/screens/MedicationProgram';
import MoreOptionsModal from './src/screens/MoreOptionsModal';
import AgendaScreen from './src/screens/AgendaScreen';
import Medicines from './src/screens/Medicines';
import HomeDatos from './src/screens/HomeDatos';
import ReminderSettings from './src/screens/ReminderSettings';
import DailyReminderSettings from './src/screens/DailyReminderSettings';
import DailyMultipleReminders from './src/screens/DailyMultipleReminders';
import Progress from './src/screens/Progress';
import EditMedicationScreen from './src/screens/EditMedicationScreen';
import AnotacionScreen from './src/screens/AnotacionScreen';
import MedicalAppointmentsScreen from './src/screens/MedicalAppointmentsScreen';
import EditarFrecuenciaScreen from './src/screens/EditarFrecuenciaScreen';
import DoctorsScreen from './src/screens/DoctorsScreen';
import AppointmentScreen from './src/screens/AppointmentScreen';
import AddDoctorScreen from './src/screens/AddDoctorScreen';

const Stack = createStackNavigator();

// Función para limpiar AsyncStorage (opcional)
const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage limpiado');
  } catch (error) {
    console.error('Error limpiando AsyncStorage:', error);
  }
};

const App = () => {
  useEffect(() => {
    clearStorage(); // Limpia el AsyncStorage si es necesario
  }, []);

  return (
    <TokenProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            cardStyleInterpolator: ({ current }) => ({
              cardStyle: {
                opacity: current.progress,
              },
            }),
            headerShown: false,
          }}
        >
          {/* Pantallas de la aplicación */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Nuevo" component={NuevoUsuario} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="PresentationScreen" component={PresentationScreen} />
          <Stack.Screen name="MedicationScreen" component={MedicationScreen} />
          <Stack.Screen name="UnaVezAlDiaScreen" component={UnaVezAlDiaScreen} />
          <Stack.Screen name="AdditionalForm" component={AdditionalForm} />
          <Stack.Screen name="TreatmentDuration" component={TreatmentDuration} />
          <Stack.Screen name="DurationOfTreatment2" component={DurationOfTreatment2} />
          <Stack.Screen name="RefillingMedications" component={RefillingMedications} />
          <Stack.Screen name="MedicationInstructions" component={MedicationInstructions} />
          <Stack.Screen name="TwiceaDay" component={TwiceaDay} />
          <Stack.Screen name="ThreeTimesADay" component={ThreeTimesADay} />
          <Stack.Screen name="MedicationProgram" component={MedicationProgram} />
          <Stack.Screen name="MoreOptionsModal" component={MoreOptionsModal} />
          <Stack.Screen name="AgendaScreen" component={AgendaScreen} />
          <Stack.Screen name="Medicines" component={Medicines} />
          <Stack.Screen name="Progress" component={Progress} />
          <Stack.Screen name="HomeDatos" component={HomeDatos} />
          <Stack.Screen name="DailyReminderSettings" component={DailyReminderSettings} />
          <Stack.Screen name="DailyMultipleReminders" component={DailyMultipleReminders} />
          <Stack.Screen name="EditMedicationScreen" component={EditMedicationScreen} />
          <Stack.Screen name="AnotacionScreen" component={AnotacionScreen} />
          <Stack.Screen name="AppointmentScreen" component={AppointmentScreen} />
          <Stack.Screen name="MedicalAppointmentsScreen" component={MedicalAppointmentsScreen} />
          <Stack.Screen name="DoctorsScreen" component={DoctorsScreen} />
          <Stack.Screen name="ReminderSettings" component={ReminderSettings} />
          <Stack.Screen name="AddDoctorScreen" component={AddDoctorScreen} />
          <Stack.Screen name="EditarFrecuenciaScreen" component={EditarFrecuenciaScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TokenProvider>
  );
};

export default App;
