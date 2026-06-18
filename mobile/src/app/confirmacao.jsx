import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import Header from "../components/header";
import { useLocalSearchParams, useRouter } from "expo-router";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ConfirmacaoProduto() {
  const router = useRouter();
  const { id, nome, preco, descricao, imagem, quantidade, pagamento } = useLocalSearchParams();
  const [finalizando, setFinalizando] = useState(false);
  const [erro, setErro] = useState(null);

  const valor = preco && quantidade
    ? `R$ ${(Number(preco) * Number(quantidade)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    : `R$ ${Number(preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  const handleFinalizar = async () => {
    try {
      setFinalizando(true);
      setErro(null);

      const usuarioSalvo = await AsyncStorage.getItem("usuario");
      const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

      if (!usuario) {
        setErro("Você precisa estar logado para finalizar a compra.");
        return;
      }

      const id_usuario = usuario.id_usuario ?? usuario.id;

      const response = await fetch(`${API_URL}/pedidos/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario,
          id_produto: Number(id),
          quantidade: Number(quantidade) || 1,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setErro(errData.message || "Erro ao finalizar pedido.");
        return;
      }

      router.push("/(tabs)");
    } catch (err) {
      console.log("Erro ao finalizar:", err);
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setFinalizando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Confirmação do Pedido</Text>
        <Octicons name="verified" size={50} color="green" style={styles.icone} />

        <View style={styles.card}>
          <Image source={{ uri: imagem }} style={styles.image} />

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

        {erro && (
          <Text style={styles.textoErro}>{erro}</Text>
        )}

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={finalizando}
          >
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, finalizando && { opacity: 0.6 }]}
            onPress={handleFinalizar}
            disabled={finalizando}
          >
            {finalizando
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.nextText}>Finalizar</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  content: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginVertical: 20, textAlign: "center" },
  card: { backgroundColor: "#2A2A2A", borderRadius: 10, padding: 20, marginBottom: 30, borderColor: "#A636E9", borderWidth: 1 },
  image: { width: 150, height: 150, borderRadius: 10, marginBottom: 20, alignSelf: "center" },
  infoRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  infoTextos: { flex: 1 },
  icone: { marginBottom: 20, marginLeft: "auto", marginRight: "auto" },
  label: { color: "#aaa", fontSize: 16, marginTop: 10 },
  value: { color: "#fff", fontSize: 18, fontWeight: "600" },
  textoErro: { color: "#f87171", textAlign: "center", marginBottom: 16, fontSize: 14 },
  buttons: { flexDirection: "row", justifyContent: "space-between" },
  backButton: { backgroundColor: "#666", padding: 15, borderRadius: 8, flex: 1, marginRight: 10, alignItems: "center" },
  nextButton: { backgroundColor: "#A636E9", padding: 15, borderRadius: 8, flex: 1, marginLeft: 10, alignItems: "center" },
  backText: { color: "#fff", fontSize: 16 },
  nextText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});