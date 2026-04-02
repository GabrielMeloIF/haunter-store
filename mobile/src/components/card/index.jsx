import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";

const perifericos = [
  {
    id: 1,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    descricao: "Fone de ouvido bluetooth com bateria de longa duração",
    preco: "R$ 320,00",
    imagem: require("../../../assets/headset 1.png"),
  },
 {
    id: 2,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    descricao: "Fone de ouvido bluetooth com bateria de longa duração",
    preco: "R$ 320,00",
    imagem: require("../../../assets/headset 1.png"),
  },
];

const games = [
  {
    id: 3,
    nome: "God of War",
    descricao: "Batalhas épicas com gráficos impressionantes",
    preco: "R$ 199,00",
    imagem: require("../../../assets/god.webp"),
  },
   {
    id: 4,
    nome: "God of War",
    descricao: "Batalhas épicas com gráficos impressionantes",
    preco: "R$ 199,00",
    imagem: require("../../../assets/forza.png"),
  },
];

export default function Cards() {
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
      {/* Imagem */}
      <View style={styles.imageContainer}>
        <Image source={produto.imagem} style={styles.image} resizeMode="cover" />
        <TouchableOpacity
          style={styles.starBtn}
          onPress={() => toggleFavorito(produto.id)}
        >
          <AntDesign
            name={favoritos.includes(produto.id) ? "star" : "star"}
            size={22}
            color={favoritos.includes(produto.id) ? "#facc15" : "#fff"}
          />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.nome}>{produto.nome}</Text>

        <View style={styles.footer}>
          <Text style={styles.preco}>{produto.preco}</Text>
          <TouchableOpacity style={styles.comprarBtn}>
            <Text style={styles.comprarText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Periféricos */}
      <Text style={styles.sectionTitle}>Periféricos</Text>
      <View style={styles.grid}>
        {perifericos.map((produto) => (
          <CardItem key={produto.id} produto={produto} />
        ))}
      </View>

      {/* Jogos */}
      <Text style={styles.sectionTitle}>Jogos</Text>
      <View style={styles.grid}>
        {games.map((produto) => (
          <CardItem key={produto.id} produto={produto} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
    marginBottom: 16,
  },
  card: {
    width: "47%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#3a3a3a",
  },
  imageContainer: {
    width: "100%",
    height: 200,
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
    padding: 16,
    backgroundColor: "#4a4a4a",
    gap: 12,
  },
  nome: {
    color: "#fff",
    fontSize: 14,
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
    width: 82,
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