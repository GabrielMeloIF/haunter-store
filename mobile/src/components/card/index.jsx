import {
  View,
  Text,
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
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

const CARD_GAP = 12;
const CARD_WIDTH = width * 0.48;

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

  // buscar produtos
  useEffect(() => {
    async function buscarProdutos() {
      try {
        const response = await fetch(
          "http://192.168.56.1:4000/produtos"
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
          source={{ uri: produto.imagem_url }}
          style={styles.image}
          contentFit="contain"
          transition={200}
        />

        <TouchableOpacity
          style={styles.starBtn}
          onPress={() => toggleFavorito(produto.id)}
        >
          <AntDesign
            name="star"
            size={18}
            color={
              favoritos.includes(produto.id)
                ? "#facc15"
                : "#fff"
            }
          />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text
          style={styles.nome}
          numberOfLines={2}
        >
          {produto.nome}
        </Text>

        <Text style={styles.preco}>
          R$ {produto.preco}
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
                imagem: produto.imagem_url,
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
  );

  if (loading) {
    return (
      <View style={{ paddingTop: 40 }}>
        <ActivityIndicator
          size="large"
          color="#A636E9"
        />
      </View>
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
          paddingHorizontal: 16,
          paddingBottom: 8,
        }}
        renderItem={({ item }) => (
          <View
            style={{
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
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  card: {
    width: CARD_WIDTH,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#3a3a3a",
  },

  imageContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: 10,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  starBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
  },

  info: {
    padding: 14,
    gap: 12,
  },

  nome: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    minHeight: 36,
  },

  preco: {
    color: "#A636E9",
    fontSize: 18,
    fontWeight: "bold",
  },

  comprarBtn: {
    backgroundColor: "#A636E9",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  comprarText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
});