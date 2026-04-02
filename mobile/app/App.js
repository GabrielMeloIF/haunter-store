import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,ScrollView } from 'react-native';
import Header from './components/header';
import NavBar from './components/navbar';
import Carrossel from './components/carrossel';
import Cards from './components/card';
import Footer from './components/footer';

export default function App() {
  return (
    <ScrollView>
    <View style={styles.container}>
       <StatusBar style="auto" />
      <View style={{ width: '100%' }}>
      <Header />
      </View>
      <NavBar />
      <Carrossel />

      <View>
        <Cards />
      </View>
  
      <Footer />

      
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#303030',
},
});
