import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View,  ScrollView,} from "react-native";
import Header from "../src/components/header";
import NavBar from "../src/components/navbar";
import Carrossel from "../src/components/carrossel";
import Cards from "../src/components/card";


export default function Home() {
  return (

    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <NavBar />
        <Carrossel />
        <Cards />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#303030",
  },
});

