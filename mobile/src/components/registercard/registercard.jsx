import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";

import { useState } from "react";

const API_URL = "http://192.168.56.1:4000";

export default function Register() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const cadastrar = async () => {
    try {
      if (
        !nome ||
        !email ||
        !senha ||
        !confirmarSenha
      ) {
        Alert.alert(
          "Erro",
          "Preencha todos os campos"
        );

        return;
      }

      if (senha !== confirmarSenha) {
        Alert.alert(
          "Erro",
          "As senhas não coincidem"
        );

        return;
      }

      const response = await fetch(
        `${API_URL}/users`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            nome,
            email,
            senha,
            confirmar_senha:
              confirmarSenha,
          }),
        }
      );

      if (!response.ok) {
        const erro =
          await response.text();

        console.log(erro);

        throw new Error(
          "Erro ao cadastrar"
        );
      }

      Alert.alert(
        "Sucesso",
        "Conta criada!"
      );

      router.push("/login");

    } catch (error) {
      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível cadastrar"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Registre-se
      </Text>

      <View>
        <TextInput
          style={styles.inputs}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.inputs}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.inputs}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TextInput
          style={styles.inputs}
          placeholder="Confirme a senha"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.push("/(tabs)")
            }
          >
            <Text style={{ color: "#000" }}>
              Voltar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={cadastrar}
          >
            <Text style={{ color: "#fff" }}>
              Cadastrar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.loginText}>
        Já tem conta?{" "}

        <Text
          style={styles.loginLink}
          onPress={() =>
            router.push("/login")
          }
        >
          Entre já
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7D7D7D",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },

  inputs: {
    width: 300,
    padding: 12,
    backgroundColor: "#D9D9D9",
    marginBottom: 10,
    borderRadius: 30,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
    marginTop: 20,
  },

  backButton: {
    backgroundColor: "#D9D9D9",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },

  registerButton: {
    backgroundColor: "#430883",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },

  loginText: {
    marginTop: 20,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  loginLink: {
    color: "#691CA3",
    fontWeight: "bold",
  },
});