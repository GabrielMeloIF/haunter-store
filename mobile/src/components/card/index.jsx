import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const CARD_GAP = 12;
const CARD_WIDTH = width < 400 ? width * 0.45 : width * 0.45;

 const perifericos = [
  {
    id: 1,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    descricao:"Headphone gamer JBL com conexão bluetooth, áudio imersivo e bateria com duração de até 24 horas.",
    imagem: require("../../../assets/headset 1.png"),
  },
  {
    id: 2,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    descricao:
      "Fone de ouvido JBL sem fio com graves potentes, conforto premium e baixa latência para jogos.",
    imagem: require("../../../assets/headset 1.png"),
  },
  {
    id: 5,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    descricao:
      "Headset gamer com isolamento acústico, microfone integrado e conexão rápida bluetooth.",
    imagem: require("../../../assets/headset 1.png"),
  },
  {
    id: 6,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    descricao:
      "Experiência sonora de alta qualidade com áudio estéreo e design ergonômico para longas partidas.",
    imagem: require("../../../assets/headset 1.png"),
  },
  {
    id: 7,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    descricao:
      "Headphone JBL ideal para gamers, músicas e chamadas com bateria de longa duração.",
    imagem: require("../../../assets/headset 1.png"),
  },
  {
    id: 8,
    nome: "Head phone JBL bluetooth bateria para 24hrs",
    preco: "R$ 320,00",
    descricao:
      "Som cristalino, conexão estável e almofadas confortáveis para máximo desempenho.",
    imagem: require("../../../assets/headset 1.png"),
  },
];

const games = [
  {
    id: 9,
    nome: "God of War",
    preco: "R$ 199,00",
    descricao:
      "Acompanhe Kratos e Atreus em uma jornada épica pelos reinos nórdicos repleta de ação e emoção.",
    imagem: require("../../../assets/god.webp"),
  },
  {
    id: 10,
    nome: "Forza",
    preco: "R$ 199,00",
    descricao:
      "Explore corridas em mundo aberto com gráficos realistas e centenas de carros incríveis.",
    imagem: require("../../../assets/forza.png"),
  },
  {
    id: 11,
    nome: "God of War",
    preco: "R$ 199,00",
    descricao:
      "Combates intensos, gráficos cinematográficos e uma história emocionante sobre pai e filho.",
    imagem: require("../../../assets/god.webp"),
  },
  {
    id: 12,
    nome: "Forza",
    preco: "R$ 199,00",
    descricao:
      "Dirija carros lendários em pistas desafiadoras e ambientes extremamente detalhados.",
    imagem: require("../../../assets/forza.png"),
  },
  {
    id: 13,
    nome: "God of War",
    preco: "R$ 199,00",
    descricao:
      "Uma aventura épica repleta de batalhas contra criaturas mitológicas e deuses poderosos.",
    imagem: require("../../../assets/god.webp"),
  },
  {
    id: 14,
    nome: "Forza",
    preco: "R$ 199,00",
    descricao:
      "Experiência de corrida definitiva com clima dinâmico e física ultra realista.",
    imagem: require("../../../assets/forza.png"),
  },
];

const consoles = [
  {
    id: 15,
    nome: "PlayStation 5",
    preco: "R$ 3.999,00",
    descricao:
      "Console de nova geração da Sony com SSD ultrarrápido e gráficos em 4K.",
    imagem: require("../../../assets/ps5.png"),
  },
  {
    id: 16,
    nome: "Xbox Series X",
    preco: "R$ 4.299,00",
    descricao:
      "O Xbox mais poderoso já criado, com desempenho extremo e suporte para jogos em 120 FPS.",
    imagem: require("../../../assets/xbox.png"),
  },
  {
    id: 17,
    nome: "Nintendo Switch",
    preco: "R$ 2.199,00",
    descricao:
      "Console híbrido da Nintendo que permite jogar na TV ou no modo portátil.",
    imagem: require("../../../assets/switch.png"),
  },
  {
    id: 18,
    nome: "PlayStation 5 Slim",
    preco: "R$ 4.199,00",
    descricao:
      "Versão compacta do PS5 com design moderno e toda a potência da nova geração.",
    imagem: require("../../../assets/ps5.png"),
  },
  {
    id: 19,
    nome: "Xbox Series S",
    preco: "R$ 2.799,00",
    descricao:
      "Console compacto da Microsoft com excelente desempenho e carregamento rápido.",
    imagem: require("../../../assets/xbox.png"),
  },
  {
    id: 20,
    nome: "Nintendo Switch OLED",
    preco: "R$ 2.599,00",
    descricao:
      "Tela OLED vibrante, áudio aprimorado e melhor experiência portátil da Nintendo.",
    imagem: require("../../../assets/switch.png"),
  },
];

const pcs = [
  {
    id: 21,
    nome: "PC Gamer RTX 4060",
    preco: "R$ 5.499,00",
    descricao:
      "PC gamer equipado com RTX 4060 para rodar jogos modernos em alta qualidade.",
    imagem: require("../../../assets/pc1.png"),
  },
  {
    id: 22,
    nome: "PC Gamer Ryzen 7",
    preco: "R$ 6.299,00",
    descricao:
      "Desempenho extremo com processador Ryzen 7 ideal para jogos e multitarefa.",
    imagem: require("../../../assets/pc2.png"),
  },
  {
    id: 23,
    nome: "PC Gamer Intel i5",
    preco: "R$ 4.199,00",
    descricao:
      "Setup gamer equilibrado com ótimo desempenho para jogos competitivos.",
    imagem: require("../../../assets/pc3.png"),
  },
  {
    id: 24,
    nome: "Setup Gamer RGB",
    preco: "R$ 7.999,00",
    descricao:
      "PC gamer completo com iluminação RGB, alto desempenho e visual moderno.",
    imagem: require("../../../assets/pc4.png"),
  },
  {
    id: 25,
    nome: "PC Gamer RTX 4070",
    preco: "R$ 8.499,00",
    descricao:
      "Máquina de alto desempenho preparada para jogos em 2K e Ray Tracing.",
    imagem: require("../../../assets/pc1.png"),
  },
  {
    id: 26,
    nome: "PC Gamer Water Cooler",
    preco: "R$ 6.999,00",
    descricao:
      "PC gamer refrigerado com water cooler para máxima performance e estabilidade.",
    imagem: require("../../../assets/pc2.png"),
  },
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
        <Image
          source={produto.imagem}
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
           onPress={() =>
  router.push({
    pathname: "/comprar",
    params: {
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      descricao: produto.descricao,
      imagem: JSON.stringify(produto.imagem), 
    },
  })
}
          >
            <Text style={styles.comprarText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const Carrossel = ({ data }) => (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingLeft: 16,
        paddingRight: 40,
        paddingBottom: 8,
      }}
      renderItem={({ item }) => (
        <View style={{ width: CARD_WIDTH, marginRight: CARD_GAP }}>
          <CardItem produto={item} />
        </View>
      )}
      // snap travando em 2 cards por vez
      snapToInterval={(CARD_WIDTH + CARD_GAP) * 2}
      decelerationRate="fast"
      pagingEnabled={false}
    />
  );

  const secoes = [
    { key: "perifericos", titulo: "Periféricos", data: perifericos },
    { key: "jogos", titulo: "Jogos", data: games },
    { key: "consoles", titulo: "Consoles", data: consoles },
    { key: "Pcs", titulo: "Pcs", data: pcs },
  ];

  return (
    <View style={styles.container}>
      {secoes.map((item) => (
        <View style={styles.secao} key={item.key}>
          <Text style={styles.sectionTitle}>{item.titulo}</Text>

          <Carrossel data={item.data} />
        </View>
      ))}
    </View>
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
