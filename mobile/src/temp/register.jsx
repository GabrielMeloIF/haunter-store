import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Header from '../components/header';
import Register from '../components/registercard/registercard';



export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.card}>
        <Register />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#303030',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#7D7D7D',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    height: '40%',
    borderRadius: 30,
    marginTop: '30%',
  }
});