import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/header";
import { useRouter, useLocalSearchParams } from "expo-router";

const API_URL = "http://10.81.201.7:5000";

export default function Comprar() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const produto = {
    id: Number(params.id),
    nome: params.nome,
    preco: params.preco,
    descricao: params.descricao,
    imagem: params.imagem, // vindo do cards
  };

  const [favoritos, setFavoritos] = useState([]);
  const [nota, setNota] = useState(0);
  const [comentarioNovo, setComentarioNovo] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  const carregarFavoritos = async () => {
    const salvo = await AsyncStorage.getItem("favoritos");
    setFavoritos(salvo ? JSON.parse(salvo) : []);
  };

  const toggleFavorito = async (id) => {
    const novos = favoritos.includes(id)
      ? favoritos.filter((f) => f !== id)
      : [...favoritos, id];

    setFavoritos(novos);
    await AsyncStorage.setItem("favoritos", JSON.stringify(novos));
  };

  const adicionarAoCarrinho = async () => {
    const salvo = await AsyncStorage.getItem("carrinho");
    const itens = salvo ? JSON.parse(salvo) : [];

    const novoItem = {
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem,
      quantidade: 1,
    };

    itens.push(novoItem);

    await AsyncStorage.setItem("carrinho", JSON.stringify(itens));

    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  // 🔥 COMENTÁRIO NO BANCO
  const adicionarComentario = async () => {
    if (!comentarioNovo.trim()) return;

    const novo = {
      produtoId: produto.id,
      nota,
      texto: comentarioNovo,
    };

    try {
      await fetch(`${API_URL}/comentarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novo),
      });

      setComentarios([...comentarios, novo]);
      setComentarioNovo("");
      setNota(0);
    } catch (err) {
      console.log("Erro ao enviar comentário:", err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {toast && (
        <View style={styles.toast}>
          <Text style={styles.toastTexto}>
            ✓ Produto adicionado ao carrinho!
          </Text>
        </View>
      )}

      <Header />

      {/* IMAGEM */}
      <View style={styles.galeriaContainer}>
        <Image
          source={{ uri: produto.imagem }}
          style={styles.imagemPrincipal}
        />
      </View>

      {/* PRODUTO */}
      <View style={styles.card}>
        <Text style={styles.nome}>{produto.nome}</Text>

        <Text style={styles.descricao}>{produto.descricao}</Text>

        <Text style={styles.preco}>R$ {produto.preco}</Text>

        <View style={styles.botoes}>
          <TouchableOpacity
            style={styles.btn}
            onPress={adicionarAoCarrinho}
          >
            <Text style={styles.btnText}>Adicionar ao carrinho</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => router.push("/finalizar")}
          >
            <Text style={styles.btnText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* AVALIAÇÃO */}
      <View style={styles.card}>
        <Text style={styles.nome}>Avaliar produto</Text>

        <View style={{ flexDirection: "row" }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Text
              key={n}
              onPress={() => setNota(n)}
              style={{
                fontSize: 30,
                color: n <= nota ? "yellow" : "#555",
              }}
            >
              ★
            </Text>
          ))}
        </View>

        <TextInput
          value={comentarioNovo}
          onChangeText={setComentarioNovo}
          placeholder="Escreva um comentário..."
          placeholderTextColor="#aaa"
          style={styles.input}
        />

        <TouchableOpacity style={styles.btn} onPress={adicionarComentario}>
          <Text style={styles.btnText}>Enviar comentário</Text>
        </TouchableOpacity>

        {comentarios.map((c, i) => (
          <View key={i} style={styles.comment}>
            <Text style={{ color: "yellow" }}>
              {"★".repeat(c.nota)}
            </Text>
            <Text style={{ color: "#fff" }}>{c.texto}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030",
  },

  galeriaContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  imagemPrincipal: {
    width: "90%",
    height: 260,
    borderRadius: 15,
  },

  card: {
    margin: 16,
    backgroundColor: "#3a3a3a",
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },

  nome: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  descricao: {
    color: "#ccc",
  },

  preco: {
    color: "#A636E9",
    fontSize: 22,
    fontWeight: "bold",
  },

  botoes: {
    flexDirection: "row",
    gap: 10,
  },

  btn: {
    flex: 1,
    backgroundColor: "#A636E9",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "#4a4a4a",
    padding: 10,
    borderRadius: 8,
    color: "#fff",
  },

  comment: {
    marginTop: 10,
    backgroundColor: "#4a4a4a",
    padding: 10,
    borderRadius: 8,
  },

  toast: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#A636E9",
    padding: 12,
    borderRadius: 20,
    zIndex: 999,
  },

  toastTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});