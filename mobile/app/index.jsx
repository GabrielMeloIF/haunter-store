import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View,  ScrollView,} from "react-native";
import Header from "../src/components/header";
import NavBar from "../src/components/navbar";
import Carrossel from "../src/components/carrossel";
import Cards from "../src/components/card";
import Filtro from "../src/components/filtro";
import { UserProvider } from "../src/components/context/userContext";


export default function Home() {
  return (
    <UserProvider>

    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Carrossel />
          <Filtro />
          <Cards />
      </ScrollView>
    </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030",
  },
});

