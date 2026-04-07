import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Header from '../src/components/header';
import Login from '../src/components/logincard/logincard';



export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.card}>
        <Login />
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
    borderRadius: 30,
    marginTop: '30%',
  }
});