import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

const API_URL = "http://10.81.204.25:5000";

export default function Pesquisa() {
  const { q } = useLocalSearchParams();
  const router = useRouter();

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscar() {
      try {
        const response = await fetch(
          `${API_URL}/produtos?busca=${encodeURIComponent(q)}`,
        );

        const dados = await response.json();

        console.log("Busca:", q);
        console.log("Resultados:", dados);

        setProdutos(dados);
      } catch (error) {
        console.log("Erro na pesquisa:", error);
      } finally {
        setLoading(false);
      }
    }

    if (q) {
      buscar();
    }
  }, [q]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imagem_url }}
        style={styles.image}
        contentFit="cover"
      />

      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={2}>
          {item.nome}
        </Text>

        <Text style={styles.preco}>R$ {Number(item.preco).toFixed(2)}</Text>

        <TouchableOpacity
          style={styles.botao}
          onPress={() =>
            router.push({
              pathname: "/comprar",
              params: {
                id: item.id,
                nome: item.nome,
                preco: item.preco,
                descricao: item.descricao,
                imagem: item.imagem_url,
              },
            })
          }
        >
          <Text style={styles.botaoTexto}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.titulo}>Resultados para: "{q}"</Text>

      {loading ? (
        <Text style={styles.infoText}>Carregando...</Text>
      ) : produtos.length === 0 ? (
        <Text style={styles.infoText}>Nenhum produto encontrado.</Text>
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    padding: 16,
  },

  titulo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  infoText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  },

  card: {
    backgroundColor: "#4a4a4a",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },

  image: {
    width: "100%",
    height: 220,
    backgroundColor: "#fff",
  },

  info: {
    padding: 12,
  },

  nome: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  preco: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  botao: {
    backgroundColor: "#A636E9",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  topBar: {
  marginBottom: 15,
},

backButton: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  alignSelf: "flex-start",
  backgroundColor: "#A636E9",
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 10,
},

backText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 14,
}
});
