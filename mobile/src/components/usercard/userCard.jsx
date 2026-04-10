import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "../context/userContext";

export default function UserCard() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState(null);
  const { setUserImage } = useUser();

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setUserImage(uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conta</Text>

      <View style={styles.card}>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={handleImagePicker}>
            <Image
              source={{ uri: imageUri || "https://via.placeholder.com/100" }} // Placeholder if no image is selected
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImagePicker}>
            <Text style={styles.changeImageText}>Alterar imagem</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.label}>Email cadastrado</Text>
          <Text style={styles.value}>Exemplo@gmail.com</Text>

          <Text style={styles.label}>Senha cadastrada</Text>
          <Text style={styles.value}>••••••••</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.patchButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.patchText}>Alterar</Text>
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

  value: {
    color: "#000",
    fontSize: 16,
    marginTop: 5,
    marginBottom: 20,
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
