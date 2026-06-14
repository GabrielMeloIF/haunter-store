import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Header from "../components/header";
import { useLocalSearchParams, useRouter } from "expo-router";
import Octicons from "@expo/vector-icons/Octicons";

export default function ConfirmacaoProduto() {
  const router = useRouter();
  const {
    id,
    nome,
    preco,
    descricao,
    imagem,
    quantidade,
    pagamento,
  } = useLocalSearchParams();

  const valor = preco && quantidade
    ? `R$ ${(Number(preco) * Number(quantidade)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    : `R$ ${Number(preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Confirmação do Pedido</Text>
        <Octicons name="verified" size={50} color="green" style={styles.icone} />

        <View style={styles.card}>
          <Image
            source={{ uri: imagem }}
            style={styles.image}
          />

          <View style={styles.infoRow}>
            <View style={styles.infoTextos}>
              <Text style={styles.label}>Produto:</Text>
              <Text style={styles.value}>{nome || "Produto não informado"}</Text>

              <Text style={styles.label}>Quantidade:</Text>
              <Text style={styles.value}>{quantidade || "1 unidade"}</Text>

              <Text style={styles.label}>Valor Total:</Text>
              <Text style={styles.value}>{valor}</Text>

              <Text style={styles.label}>Forma de Pagamento:</Text>
              <Text style={styles.value}>{pagamento || "Não selecionado"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.nextText}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    borderColor: "#A636E9",
    borderWidth: 1,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: "center",
    marginRight: 0,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoTextos: {
    flex: 1,
  },
  icone: {
    marginBottom: 20,
    marginLeft: "auto",
    marginRight: "auto",
  },
  label: {
    color: "#aaa",
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    backgroundColor: "#666",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#A636E9",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  backText: {
    color: "#fff",
    fontSize: 16,
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});