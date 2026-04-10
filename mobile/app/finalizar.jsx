import Header from "../src/components/header";
import { View, Text, StyleSheet, TextInput } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from "expo-router";
import { Checkbox } from 'expo-checkbox';
import { useState } from "react";



export default function Finalizar() {
  const router = useRouter();

  const [isChecked, setIsChecked] = useState(false);
  return (
    <View style={styles.container}>
      <Header />
      <View style={{ display: "flex", flexDirection: "row", marginTop: 32, alignItems: "center", justifyContent: "center" }}>
        <MaterialIcons name="place" size={24} color="white" style={styles.icon} />
        <Text style={styles.titulo}>Endereço</Text>
      </View>

      <View style={styles.formulario}>

        <Text style={styles.endereço}>Endereço</Text>

        <TextInput
          style={styles.inputs}
          placeholder="Rua Ex: Av. Paulista, 1000"
        />

        <Text style={styles.endereço}>Nº</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.inputs}
          placeholder="Ex:109"
        />

        <Text style={styles.endereço}>CEP</Text>
        <TextInput
          style={styles.inputs}
          placeholder="Ex: 00000-000"
        />

        <Text style={styles.endereço}>Complemento</Text>
        <TextInput
          style={styles.inputs}
          placeholder="Ex: condomínio..."
        />

        <View style={{ display: "flex", flexDirection: "column" }}>
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              style={{ borderRadius: 20, marginRight: 8 }}
              value={isChecked}
              onValueChange={setIsChecked}
            />

            <Text style={{ color: "#ffff" }}>trabalho</Text>
          </View>

          <View>
            <Checkbox
              value={isChecked}
              onValueChange={setIsChecked}
            />

            <Text style={{ color: "#ffff" }}>Casa</Text>
          </View>
        </View>


      </View>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.btnV} onPress={() => router.push("/")}>Voltar</Text>
        <Text style={styles.btnP}>Proximo</Text>

      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030"

  },
  icon: {
    marginTop: 32,
    color: "#A636E9"
  },
  titulo: {
    color: "#fff",
    fontSize: 30,
    marginTop: 32,
    paddingHorizontal: 16,
    fontWeight: "bold"
  },
  formulario: {
    marginTop: 32,
    backgroundColor: "#292929",
    borderRadius: 10,
    width: 350,
    height: 400,
    display: "flex",
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: "column",
    marginBottom: 32,
    alignSelf: "center",
    border: "0.5px solid #A636E9",
  },
  endereço: {
    color: "#fff",
    margin: 10,
    marginLeft: 23,
  },
  inputs: {
    backgroundColor: "#D9D9D9",
    borderRadius: 7,
    width: 300,
    height: 40,
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 14,
    marginBottom: 10,
    padding: 3,
    color: "#4f4f4f",
  },
  btnP: {
    backgroundColor: "#A636E9",
    padding: 8,
    borderRadius: 10,
    color: "#fff",
    width: 90,
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 20,
    fontWeight: "bold",
    alignSelf: "end",
    margin: 12,
    display: "flex",
    alignItems: "center",
  },
  btnV: {
    backgroundColor: "#6e6e6eff",
    width: 55,
    height: 38,
    borderRadius: 10,
    color: "#fff",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    margin: 10,
    fontWeight: "bold"
  }

});