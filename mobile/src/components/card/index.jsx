import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import { useState, useEffect, useCallback } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { Image } from "react-native";

const { width } = Dimensions.get("window");

const CARD_GAP = 12;
const CARD_WIDTH = width * 0.45;

const API_URL = "http://10.81.204.25:5000";

export default function Cards() {
  const router = useRouter();

  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [perifericos, setPerifericos] = useState([]);
  const [games, setGames] = useState([]);
  const [consoles, setConsoles] = useState([]);
  const [pcs, setPcs] = useState([]);

  // FAVORITOS
  const carregarFavoritos = async () => {
    try {
      const salvo = await AsyncStorage.getItem("favoritos");

      setFavoritos(salvo ? JSON.parse(salvo) : []);
    } catch (error) {
      console.log("Erro ao carregar favoritos:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarFavoritos();
    }, [])
  );

  // PRODUTOS
  useEffect(() => {
    async function buscarProdutos() {
      try {
        const response = await fetch(`${API_URL}/produtos`);

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }

        const dados = await response.json();

        console.log("DADOS BRUTOS:", dados);

        const lista = Array.isArray(dados)
          ? dados
          : Array.isArray(dados?.produtos)
          ? dados.produtos
          : [];

        console.log("LISTA FINAL:", lista);

        setPerifericos(lista.filter(p => Number(p.categoriaId) === 1));
        setPcs(lista.filter(p => Number(p.categoriaId) === 2));
        setGames(lista.filter(p => Number(p.categoriaId) === 3));
        setConsoles(lista.filter(p => Number(p.categoriaId) === 4));

      } catch (error) {
        console.log("Erro ao buscar produtos:", error);
        setErro("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    }

    buscarProdutos();
  }, []);

  const toggleFavorito = async (id) => {
    try {
      const novos = favoritos.includes(id)
        ? favoritos.filter(f => f !== id)
        : [...favoritos, id];

      setFavoritos(novos);
      await AsyncStorage.setItem("favoritos", JSON.stringify(novos));

    } catch (error) {
      console.log("Erro ao salvar favorito:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#A636E9" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>{erro}</Text>
      </View>
    );
  }

  const CardItem = ({ produto }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: produto.imagem_url }}
          style={styles.image}
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
        <Text style={styles.nome} numberOfLines={2}>
          {produto.nome}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.preco}>R$ {produto.preco}</Text>

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
            <Text style={styles.comprarText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const Carrossel = ({ data }) => (
    <FlatList
      data={data || []}
      horizontal
      keyExtractor={(item) => String(item.id)}
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
    />
  );

  const secoes = [
    { key: "perifericos", titulo: "Periféricos", data: perifericos },
    { key: "jogos", titulo: "Jogos", data: games },
    { key: "consoles", titulo: "Consoles", data: consoles },
    { key: "pcs", titulo: "PCs", data: pcs },
  ];

  return (
    <View style={styles.container}>
      {secoes.map((item) => (
        <View key={item.key} style={styles.secao}>
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  secao: {
    gap: 8,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    paddingHorizontal: 16,
  },

  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: "hidden",
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
    backgroundColor: "#1c1c2e",
    gap: 12,
  },

  nome: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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