import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView } from 'react-native';
import Header from '../src/components/header';
import NavBar from '../src/components/navbar';
import Carrossel from '../src/components/carrossel';
import Cards from '../src/components/card';
import Footer from '../src/components/footer';

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      <View style={{ width: '100%' }}>
        <Header />
      </View>
      <NavBar />
      <Carrossel />
      <View>
        <Cards />
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