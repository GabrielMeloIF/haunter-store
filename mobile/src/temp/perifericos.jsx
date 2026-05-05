import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Header from "../components/header";
import NavBar from "../components/navbar";
import Filtro from "../components/filtro";


const { width } = Dimensions.get("window");
const CARD_GAP = 16; 
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - CARD_GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

const perifericos = [
  {
    id: 1,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    imagem: require("../../assets/headset 1.png"),
  },
  {
    id: 2,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    imagem: require("../../assets/headset 1.png"),
  },
  {
    id: 3,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    imagem: require("../../assets/headset 1.png"),
  },
  {
    id: 4,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    imagem: require("../../assets/headset 1.png"),
  },
  {
    id: 5,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    imagem: require("../../assets/headset 1.png"),
  },
  {
    id: 6,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    imagem: require("../../assets/headset 1.png"),
  },
  {
    id: 7,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    imagem: require("../../assets/headset 1.png"),
  },
  {
    id: 8,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    imagem: require("../../assets/headset 1.png"),
  },
  {
    id: 9,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    imagem: require("../../assets/headset 1.png"),
  },
  {
    id: 10,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    imagem: require("../../assets/headset 1.png"),
  }
];

export default function Perifericos() {
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
    <Filtro />

    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Periféricos</Text>
      <View style={styles.grid}>
        {perifericos.map((produto) => (
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