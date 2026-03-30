import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Header from './components/header';
import NavBar from './components/navbar';
import Carrossel from './components/carrossel';
import Cards from './components/card';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={{ width: '100%' }}>
      <Header />
      </View>
      <NavBar />
      <Carrossel />

      <View>
        <Cards />
      </View>
  
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#303030',
},
});
