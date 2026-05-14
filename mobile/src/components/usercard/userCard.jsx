import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";

import * as ImagePicker from "expo-image-picker";

import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL =
  "http://192.168.56.1:4000";

export default function UserCard() {
  const router = useRouter();

  const [usuario, setUsuario] =
    useState(null);

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [imageUri, setImageUri] =
    useState(null);

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario =
    async () => {
      try {
        // pega id salvo login
        const userId =
          await AsyncStorage.getItem(
            "userId"
          );

        if (!userId) return;

        const response =
          await fetch(
            `${API_URL}/usuarios/${userId}`
          );

        const data =
          await response.json();

        setUsuario(data);

        setEmail(data.email);

        setSenha(data.senha);

        setImageUri(data.foto);

      } catch (error) {
        console.log(
          "Erro ao carregar usuário:",
          error
        );
      }
    };

  const handleImagePicker =
    async () => {
      const result =
        await ImagePicker.launchImageLibraryAsync(
          {
            mediaTypes:
              ImagePicker
                .MediaTypeOptions
                .Images,

            allowsEditing: true,

            aspect: [4, 3],

            quality: 1,
          }
        );

      if (!result.canceled) {
        setImageUri(
          result.assets[0].uri
        );
      }
    };

  const atualizarUsuario =
    async () => {
      try {
        if (!usuario) return;

        const response =
          await fetch(
            `${API_URL}/usuarios/${usuario.id}`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                email,
                senha,
                foto: imageUri,
              }),
            }
          );

        if (!response.ok) {
          throw new Error(
            "Erro ao atualizar"
          );
        }

        Alert.alert(
          "Sucesso",
          "Conta atualizada!"
        );

      } catch (error) {
        console.log(error);

        Alert.alert(
          "Erro",
          "Não foi possível atualizar"
        );
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Conta
      </Text>

      <View style={styles.card}>
        <View
          style={
            styles.profileContainer
          }
        >
          <TouchableOpacity
            onPress={
              handleImagePicker
            }
          >
            <Image
              source={{
                uri:
                  imageUri ||
                  "https://via.placeholder.com/100",
              }}
              style={
                styles.profileImage
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={
              handleImagePicker
            }
          >
            <Text
              style={
                styles.changeImageText
              }
            >
              Alterar imagem
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.label}>
            Email cadastrado
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <Text style={styles.label}>
            Senha cadastrada
          </Text>

          <TextInput
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <View
          style={
            styles.buttonContainer
          }
        >
          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={() =>
              router.push("/")
            }
          >
            <Text
              style={styles.backText}
            >
              Voltar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              styles.patchButton
            }
            onPress={
              atualizarUsuario
            }
          >
            <Text
              style={
                styles.patchText
              }
            >
              Alterar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#2F2F2F",
  },

  title: {
    fontSize: 26,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "600",
  },

  card: {
    width: "100%",
    minHeight: 400,
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    padding: 20,
  },

  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },

  changeImageText: {
    color: "#430883",
    fontWeight: "500",
  },

  label: {
    color: "#555",
    fontSize: 14,
    marginTop: 15,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 5,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  backButton: {
    backgroundColor: "#BFBFBF",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },

  patchButton: {
    backgroundColor: "#430883",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },

  backText: {
    color: "#000",
    fontWeight: "500",
  },

  patchText: {
    color: "#fff",
    fontWeight: "500",
  },
});