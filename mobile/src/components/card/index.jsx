import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.88; 
const CARD_GAP = 12;

const perifericos = [
  {
    id: 1,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    imagem: require("../../../assets/headset 1.png"),
  },
  {
    id: 2,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    imagem: require("../../../assets/headset 1.png"),
  },
  {
    id: 5,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    imagem: require("../../../assets/headset 1.png"),
  },
  {
    id: 6,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    imagem: require("../../../assets/headset 1.png"),
  },
  {
    id: 9,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    imagem: require("../../../assets/headset 1.png"),
  },
  {
    id: 10,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    imagem: require("../../../assets/headset 1.png"),
  },
];

const games = [
  {
    id: 3,
    nome: "God of War",
    preco: "R$ 199,00",
    imagem: require("../../../assets/god.webp"),
  },
  {
    id: 4,
    nome: "Forza",
    preco: "R$ 199,00",
    imagem: require("../../../assets/forza.png"),
  },
  {
    id: 7,
    nome: "God of War",
    preco: "R$ 199,00",
    imagem: require("../../../assets/god.webp"),
  },
  {
    id: 8,
    nome: "Forza",
    preco: "R$ 199,00",
    imagem: require("../../../assets/forza.png"),
  },
  {
    id: 11,
    nome: "God of War",
    preco: "R$ 199,00",
    imagem: require("../../../assets/god.webp"),
  },
  {
    id: 12,
    nome: "Forza",
    preco: "R$ 199,00",
    imagem: require("../../../assets/forza.png"),
  }
];

export default function Cards() {
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

  // ── Carrossel usando div (funciona no web) ──
  const Carrossel = ({ data }) => {
    const scrollRef = useRef(null);

    // arraste com mouse no web
    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      let isDown = false;
      let startX, scrollLeft;

      const onMouseDown = (e) => {
        e.stopPropagation();
        isDown = true;
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
      };
      const onMouseLeave = () => { isDown = false; };
      const onMouseUp = () => { isDown = false; };
      const onMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        e.stopPropagation();
        const x = e.pageX - el.offsetLeft;
        el.scrollLeft = scrollLeft - (x - startX);
      };

      el.addEventListener("mousedown", onMouseDown);
      el.addEventListener("mouseleave", onMouseLeave);
      el.addEventListener("mouseup", onMouseUp);
      el.addEventListener("mousemove", onMouseMove);
      return () => {
        el.removeEventListener("mousedown", onMouseDown);
        el.removeEventListener("mouseleave", onMouseLeave);
        el.removeEventListener("mouseup", onMouseUp);
        el.removeEventListener("mousemove", onMouseMove);
      };
    }, []);

    return (
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          flexDirection: "row",
          overflowX: "auto",         
          gap: CARD_GAP,
          paddingLeft: 16,
          paddingRight: 40,
          paddingBottom: 8,
          scrollSnapType: "x mandatory",
          cursor: "grab",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {data.map((item) => (
          <div
            key={String(item.id)}
            style={{
              minWidth: CARD_WIDTH,
              scrollSnapAlign: "center",
              flexShrink: 0,
            }}
          >
            <CardItem produto={item} />
          </div>
        ))}
      </div>
    );
  };

  const secoes = [
    { key: "perifericos", titulo: "Periféricos", data: perifericos },
    { key: "jogos", titulo: "Jogos", data: games },
  ];

  return (
    <FlatList
      data={secoes}
      keyExtractor={(item) => item.key}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.secao}>
          <Text style={styles.sectionTitle}>{item.titulo}</Text>
          <Carrossel data={item.data} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    gap: 16,
  },
  secao: {
    gap: 8,
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