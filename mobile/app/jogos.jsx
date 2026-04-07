import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Header from "../src/components/header";
import NavBar from "../src/components/navbar";

const { width } = Dimensions.get("window");
const CARD_GAP = 16;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - CARD_GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

const jogos = [
  { id: 1, nome: "God of War", preco: "R$ 199,00", imagem: require("../assets/god.webp") },
  { id: 2, nome: "Forza", preco: "R$ 199,00", imagem: require("../assets/forza.png") },
  { id: 3, nome: "God of War", preco: "R$ 199,00", imagem: require("../assets/god.webp") },
  { id: 4, nome: "Forza", preco: "R$ 199,00", imagem: require("../assets/forza.png") },
  { id: 5, nome: "Forza", preco: "R$ 199,00", imagem: require("../assets/forza.png") },
  { id: 6, nome: "God of War", preco: "R$ 199,00", imagem: require("../assets/god.webp") },
  { id: 7, nome: "Forza", preco: "R$ 199,00", imagem: require("../assets/forza.png") },
  { id: 8, nome: "God of War", preco: "R$ 199,00", imagem: require("../assets/god.webp") },
  { id: 9, nome: "Forza", preco: "R$ 199,00", imagem: require("../assets/forza.png") },
  { id: 10, nome: "God of War", preco: "R$ 199,00", imagem: require("../assets/god.webp") },
];

export default function Jogos() {
  const router = useRouter();
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      const salvo = await AsyncStorage.getItem("favoritos");
      if (salvo) setFavoritos(JSON.parse(salvo));
    };
    carregar();
  }, []);

  const toggleFavorito = async (id) => {
    const novos = favoritos.includes(id)
      ? favoritos.filter((f) => f !== id)
      : [...favoritos, id];
    setFavoritos(novos);
    await AsyncStorage.setItem("favoritos", JSON.stringify(novos));
  };

  const CardItem = ({ produto }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={produto.imagem} style={styles.image} resizeMode="cover" />
        <TouchableOpacity
          style={styles.starBtn}
          onPress={() => toggleFavorito(produto.id)}
        >
          <AntDesign
            name="star"
            size={22}
            color={favoritos.includes(produto.id) ? "#facc15" : "#fff"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.nome}>{produto.nome}</Text>
        <View style={styles.footer}>
          <Text style={styles.preco}>{produto.preco}</Text>
          <TouchableOpacity
            style={styles.comprarBtn}
            onPress={() => router.push("/comprar")}
          >
            <Text style={styles.comprarText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <style>{`body { overflow-x: hidden; }`}</style>
      <Header />
      <NavBar />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Jogos</Text>
        <View style={styles.grid}>
          {jogos.map((produto) => (
            <CardItem key={produto.id} produto={produto} />
          ))}
        </View>
      </ScrollView>

  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030",
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
    height: 120,
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
    padding: 8,
    backgroundColor: "#4a4a4a",
    gap: 6,
  },
  nome: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    lineHeight: 15,
  },
  
  preco: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  comprarBtn: {
    backgroundColor: "#A636E9",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  comprarText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
});