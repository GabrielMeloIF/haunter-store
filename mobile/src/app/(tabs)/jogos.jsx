import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";

import { useState, useEffect, useCallback  } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";

import Header from "../../components/header";

const { width } = Dimensions.get("window");

const CARD_GAP = 16;
const NUM_COLUMNS = 2;

const CARD_WIDTH =
  (width - CARD_GAP * (NUM_COLUMNS + 1)) /
  NUM_COLUMNS;

export default function Jogos() {
  const router = useRouter();

  const [favoritos, setFavoritos] = useState([]);
  const [jogos, setJogos] = useState([]);

  useFocusEffect(
  useCallback(() => {
    carregarFavoritos();
    buscarProdutos();
  }, [])
);
  const carregarFavoritos = async () => {
  const salvo = await AsyncStorage.getItem(
    "favoritos"
  );

  if (salvo) {
    setFavoritos(JSON.parse(salvo));
  } else {
    setFavoritos([]);
  }
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

  const buscarProdutos = async () => {
    try {
      const response = await fetch(
        "http://192.168.56.1:4000/produtos"
      );

      const data = await response.json();

      console.log(data);

      const produtosArray = Array.isArray(data)
        ? data
        : [];

      const apenasJogos =
        produtosArray.filter((produto) =>
          produto.categoria?.nome_categoria
            ?.toLowerCase()
            .includes("jogo")
        );

      setJogos(apenasJogos);

    } catch (error) {
      console.log(
        "Erro ao buscar produtos:",
        error
      );
    }
  };

  const CardItem = ({ produto }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: produto.imagem_url,
          }}
          style={styles.image}
          resizeMode="cover"
        />

        <TouchableOpacity
          style={styles.starBtn}
          onPress={() =>
            toggleFavorito(produto.id)
          }
        >
          <AntDesign
            name="star"
            size={22}
            color={
              favoritos.includes(produto.id)
                ? "#facc15"
                : "#fff"
            }
          />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.nome}>
          {produto.nome}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.preco}>
            R$ {produto.preco}
          </Text>

          <TouchableOpacity
            style={styles.comprarBtn}
            onPress={() =>
              router.push("/comprar")
            }
          >
            <Text style={styles.comprarText}>
              Comprar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>
          Jogos
        </Text>

        <View style={styles.grid}>
          {jogos.map((produto) => (
            <CardItem
              key={produto.id}
              produto={produto}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a",
  },

  content: {
    paddingHorizontal: CARD_GAP,
    paddingVertical: 24,
    gap: 16,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
  },

  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#3a3a3a",
  },

  imageContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#fff",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  starBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 4,
  },

  info: {
    padding: 12,
    backgroundColor: "#4a4a4a",
    gap: 10,
  },

  nome: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    lineHeight: 18,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },

  preco: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  comprarBtn: {
    backgroundColor: "#A636E9",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },

  comprarText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});