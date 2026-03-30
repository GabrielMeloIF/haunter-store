import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

// Substitua pelos seus dados reais
const perifericos = [
  {
    id: 1,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    descricao: "Fone de ouvido bluetooth com bateria de longa duração",
    preco: "R$ 320,00",
    imagem: require("../../assets/headset 1.png"),
  },
];

const games = [
  {
    id: 2,
    nome: "God of War",
    descricao: "Batalhas épicas com gráficos impressionantes",
    preco: "R$ 199,00",
    imagem: require("../../assets/god-of-war.png"),
  },
];

export default function Cards() {
  const [favoritos, setFavoritos] = useState([]);

  const toggleFavorito = (id) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
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
            name={favoritos.includes(produto.id) ? "star" : "staro"}
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
    width: 200,
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
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  preco: {
    color: "#fff",
    fontSize: 20,
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
    fontSize: 16,
    fontWeight: "bold",
  },
});