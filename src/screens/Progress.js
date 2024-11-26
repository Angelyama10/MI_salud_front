import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import NavigationBarComponent from '../components/NavigationBarComponents';
import InfoSection from '../components/InfoSection';

const { width, height } = Dimensions.get('window');

const Progress = ({ navigation }) => {
  const navItems = [
    { text: 'Inicio', iconName: 'home-heart', onPress: () => navigation.navigate('Home') },
    { text: 'Progreso', iconName: 'chart-bar', onPress: () => navigation.navigate('Progress') },
    { text: 'Más', iconName: 'dots-horizontal', onPress: () => console.log('Más presionado') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Progreso</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <InfoSection 
          imageSource={require('../../assets/images/calendario.jpg')}
          title="Revisa tu progreso"
          description="Encontrarás tus entradas anteriores aquí después de confirmar tus primeros recordatorios."
          showButton={false}
        />
      </ScrollView>
      <NavigationBarComponent navItems={navItems} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  header: {
    width: '100%',
    paddingVertical: height * 0.05,
    backgroundColor: '#5A9BD3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  headerText: {
    fontSize: width * 0.06,
    marginLeft: '4%',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    paddingBottom: 80,
  },
});

export default Progress;