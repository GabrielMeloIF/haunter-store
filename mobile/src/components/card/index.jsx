import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import { useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const CARD_GAP = 12;
const CARD_WIDTH = width < 400 ? width * 0.45 : width * 0.45;

export default function Cards() {
  const router = useRouter();

  const [favoritos, setFavoritos] = useState([]);

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  // carregar favoritos
  useEffect(() => {
    const carregarFavoritos = async () => {
      const salvo = await AsyncStorage.getItem("favoritos");

      if (salvo) {
        setFavoritos(JSON.parse(salvo));
      }
    };

    carregarFavoritos();
  }, []);

  // buscar produtos do backend
  useEffect(() => {
    async function buscarProdutos() {
      try {
        const response = await fetch(
          "http://192.168.0.10:4000/produtos"
        );

        const data = await response.json();

        setProdutos(data);
      } catch (error) {
        console.log("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    buscarProdutos();
  }, []);

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

  const CardItem = ({ produto }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: produto.imagem }}
          style={styles.image}
          resizeMode="cover"
        />

        <TouchableOpacity
          style={styles.starBtn}
          onPress={() => toggleFavorito(produto.id)}
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
            {produto.preco}
          </Text>

          <TouchableOpacity
            style={styles.comprarBtn}
            onPress={() =>
              router.push({
                pathname: "/comprar",
                params: {
                  id: produto.id,
                  nome: produto.nome,
                  preco: produto.preco,
                  descricao: produto.descricao,
                  imagem: produto.imagem,
                },
              })
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

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#A636E9"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Produtos
      </Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: 16,
          paddingRight: 40,
          paddingBottom: 8,
        }}
        renderItem={({ item }) => (
          <View
            style={{
              width: CARD_WIDTH,
              marginRight: CARD_GAP,
            }}
          >
            <CardItem produto={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    gap: 16,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    paddingHorizontal: 16,
    marginBottom: 4,
  },

  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#3a3a3a",
  },

  imageContainer: {
    width: "100%",
    height: 160,
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
    gap: 12,
  },

  nome: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 20,
  },

  footer: {
    gap: 11,
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  comprarText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});