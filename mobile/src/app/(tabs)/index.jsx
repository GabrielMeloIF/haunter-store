import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View,  ScrollView,} from "react-native";
import Header from "../../components/header";
import Carrossel from "../../components/carrossel";
import Cards from "../../components/card";




export default function Home() {
  return (


    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Carrossel />
          <Cards />
      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a",
  },
});

