import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function UserCard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conta</Text>

      <View style={styles.card}>
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
