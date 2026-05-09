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

// Mapa de imagens por id
const imagensPorId = {
  1: [
    require("../../../assets/headset 1.png"),
    require("../../../assets/headset 1.png"),
    require("../../../assets/headset 1.png"),
  ],

  2: [
    require("../../../assets/headset 1.png"),
    require("../../../assets/headset 1.png"),
  ],

  5: [
    require("../../../assets/headset 1.png"),
    require("../../../assets/headset 1.png"),
  ],

  6: [
    require("../../../assets/headset 1.png"),
    require("../../../assets/headset 1.png"),
  ],

  7: [
    require("../../../assets/headset 1.png"),
    require("../../../assets/headset 1.png"),
  ],

  8: [
    require("../../../assets/headset 1.png"),
    require("../../../assets/headset 1.png"),
  ],

  9: [
    require("../../../assets/god.webp"),
    require("../../../assets/god.webp"),
  ],

  10: [
    require("../../../assets/forza.png"),
    require("../../../assets/forza.png"),
  ],

  11: [
    require("../../../assets/god.webp"),
    require("../../../assets/god.webp"),
  ],

  12: [
    require("../../../assets/forza.png"),
    require("../../../assets/forza.png"),
  ],

  13: [
    require("../../../assets/god.webp"),
    require("../../../assets/god.webp"),
  ],

  14: [
    require("../../../assets/forza.png"),
    require("../../../assets/forza.png"),
  ],

  15: [
    require("../../../assets/ps5.png"),
    require("../../../assets/ps5.png"),
  ],

  16: [
    require("../../../assets/xbox.png"),
    require("../../../assets/xbox.png"),
  ],

  17: [
    require("../../../assets/switch.png"),
    require("../../../assets/switch.png"),
  ],

  18: [
    require("../../../assets/ps5.png"),
    require("../../../assets/ps5.png"),
  ],

  19: [
    require("../../../assets/xbox.png"),
    require("../../../assets/xbox.png"),
  ],

  20: [
    require("../../../assets/switch.png"),
    require("../../../assets/switch.png"),
  ],

  21: [
    require("../../../assets/pc1.png"),
    require("../../../assets/pc1.png"),
  ],

  22: [
    require("../../../assets/pc2.png"),
    require("../../../assets/pc2.png"),
  ],

  23: [
    require("../../../assets/pc3.png"),
    require("../../../assets/pc3.png"),
  ],

  24: [
    require("../../../assets/pc4.png"),
    require("../../../assets/pc4.png"),
  ],

  25: [
    require("../../../assets/pc1.png"),
    require("../../../assets/pc1.png"),
  ],

  26: [
    require("../../../assets/pc2.png"),
    require("../../../assets/pc2.png"),
  ],
};

export default function Comprar() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const id = Number(params.id);

  const produto = {
    id,
    nome: params.nome,
    preco: params.preco,
    descricao: params.descricao,
    imagens:
      imagensPorId[id] ?? [require("../../../assets/headset 1.png")],
  };

  const [favoritos, setFavoritos] = useState([]);
  const [nota, setNota] = useState(0);
  const [comentarioNovo, setComentarioNovo] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [imagemAtual, setImagemAtual] = useState(0);
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

    await AsyncStorage.setItem(
      "favoritos",
      JSON.stringify(novos)
    );
  };

  const adicionarAoCarrinho = async () => {
    const salvo = await AsyncStorage.getItem("carrinho");

    const ids = salvo ? JSON.parse(salvo) : [];

    ids.push(produto.id);

    await AsyncStorage.setItem(
      "carrinho",
      JSON.stringify(ids)
    );

    setToast(true);

    setTimeout(() => {
      setToast(false);
    }, 2500);
  };

  const adicionarComentario = () => {
    if (!comentarioNovo.trim()) return;

    setComentarios([
      ...comentarios,
      {
        texto: comentarioNovo,
        estrelas: nota,
      },
    ]);

    setComentarioNovo("");
    setNota(0);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      {toast && (
        <View style={styles.toast}>
          <Text style={styles.toastTexto}>
            ✓ Produto adicionado ao carrinho!
          </Text>
        </View>
      )}

      <View style={styles.conteudo}>
        <Header />

        {/* GALERIA */}
        <View style={styles.galeriaContainer}>
          <Image
            source={produto.imagens[imagemAtual]}
            style={styles.imagemPrincipal}
          />

          <View style={styles.miniaturasContainer}>
            <TouchableOpacity
              onPress={() =>
                setImagemAtual(
                  imagemAtual === 0
                    ? produto.imagens.length - 1
                    : imagemAtual - 1
                )
              }
            >
              <Text style={styles.seta}>{"<"}</Text>
            </TouchableOpacity>

            {produto.imagens.map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setImagemAtual(index)}
              >
                <Image
                  source={img}
                  style={[
                    styles.miniatura,
                    index === imagemAtual &&
                      styles.miniaturaAtiva,
                  ]}
                />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() =>
                setImagemAtual(
                  (imagemAtual + 1) %
                    produto.imagens.length
                )
              }
            >
              <Text style={styles.seta}>{">"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CARD PRODUTO */}
        <View style={styles.cardProduto}>
          <Text style={styles.nomeProduto}>
            {produto.nome}
          </Text>

          <View style={styles.estrelasContainer}>
            {[1, 2, 3, 4, 5].map((estrela) => (
              <Text
                key={estrela}
                style={[
                  styles.estrela,
                  estrela <= nota && {
                    color: "yellow",
                  },
                ]}
                onPress={() => setNota(estrela)}
              >
                ★
              </Text>
            ))}
          </View>

          <Text style={styles.descricaoProduto}>
            {produto.descricao}
          </Text>

          <Text style={styles.precoProduto}>
            {produto.preco}
          </Text>

          <View style={styles.botoesContainer}>
            <TouchableOpacity
              style={styles.botao}
              onPress={adicionarAoCarrinho}
            >
              <Text style={styles.textoBotao}>
                Adicionar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botao}
              onPress={() =>
                router.push("/(tabs)/conversas")
              }
            >
              <Text style={styles.textoBotao}>
                Conversar
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
              style={styles.botao}
              onPress={() =>
                router.push("/finalizar")
              }
            >
              <Text style={styles.textoBotao}>
                Comprar
              </Text>
            </TouchableOpacity>
        </View>

        {/* COMENTÁRIOS */}
        <View style={styles.cardProduto}>
          <Text style={styles.nomeProduto}>
            Avalie este produto
          </Text>

          <View style={styles.estrelasContainer}>
            {[1, 2, 3, 4, 5].map((estrela) => (
              <Text
                key={estrela}
                style={[
                  styles.estrela,
                  estrela <= nota && {
                    color: "yellow",
                  },
                ]}
                onPress={() => setNota(estrela)}
              >
                ★
              </Text>
            ))}
          </View>

          <TextInput
            style={styles.inputComentario}
            placeholder="Deixe seu comentário..."
            placeholderTextColor="#aaa"
            value={comentarioNovo}
            onChangeText={setComentarioNovo}
          />

          <TouchableOpacity
            style={styles.botao}
            onPress={adicionarComentario}
          >
            <Text style={styles.textoBotao}>
              Enviar
            </Text>
          </TouchableOpacity>

          {comentarios.map((c, i) => (
            <View
              key={i}
              style={styles.comentarioBox}
            >
              <Text style={{ color: "yellow" }}>
                {"★".repeat(c.estrelas)}
              </Text>

              <Text style={{ color: "#fff" }}>
                {c.texto}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030",
  },

  scrollContainer: {
    paddingBottom: 40,
  },

  conteudo: {
    gap: 20,
  },

  toast: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#A636E9",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 99,
    zIndex: 999,
  },

  toastTexto: {
    color: "#fff",
    fontWeight: "bold",
  },

  // GALERIA

  galeriaContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  imagemPrincipal: {
    width: "88%",
    height: 260,
    borderRadius: 20,
    resizeMode: "cover",
  },

  miniaturasContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    gap: 10,
  },

  miniatura: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },

  miniaturaAtiva: {
    borderColor: "#A636E9",
  },

  seta: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },

  // CARD PRODUTO

  cardProduto: {
    backgroundColor: "#3a3a3a",
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 18,
    gap: 12,
  },

  nomeProduto: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  descricaoProduto: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 22,
  },

  precoProduto: {
    color: "#A636E9",
    fontSize: 24,
    fontWeight: "bold",
  },

  estrelasContainer: {
    flexDirection: "row",
    gap: 4,
  },

  estrela: {
    fontSize: 30,
    color: "#555",
  },

  botoesContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  botao: {
    flex: 1,
    backgroundColor: "#A636E9",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  textoBotao: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },

  // COMENTÁRIOS

  inputComentario: {
    backgroundColor: "#4a4a4a",
    color: "#fff",
    borderRadius: 10,
    padding: 12,
    minHeight: 90,
    textAlignVertical: "top",
  },

  comentarioBox: {
    marginTop: 12,
    backgroundColor: "#4a4a4a",
    padding: 12,
    borderRadius: 10,
    gap: 6,
  },
});