import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Carrinho() {
  const [itens, setItens] = useState([]);

  useEffect(() => {
    carregarCarrinho();
  }, []);

  const carregarCarrinho = async () => {
    try {
      const salvo = await AsyncStorage.getItem("carrinho");
      let dados = salvo ? JSON.parse(salvo) : [];

      // 🔥 garante compatibilidade com formato antigo (ids)
      if (dados.length > 0 && typeof dados[0] === "number") {
        dados = [];
      }

      setItens(dados);
    } catch (err) {
      console.log("erro carrinho:", err);
    }
  };

  const removerItem = async (id) => {
    const novo = itens.filter((i) => i.id !== id);
    setItens(novo);
    await AsyncStorage.setItem("carrinho", JSON.stringify(novo));
  };

  const total = itens.reduce(
    (acc, item) => acc + Number(item.preco || 0),
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho</Text>

      <ScrollView>
        {itens.length === 0 ? (
          <Text style={{ color: "#fff" }}>
            Carrinho vazio
          </Text>
        ) : (
          itens.map((item) => (
            <View key={item.id} style={styles.card}>
              
              {item.imagem ? (
                <Image
                  source={{ uri: item.imagem }}
                  style={styles.image}
                />
              ) : (
                <View style={styles.placeholder} />
              )}

              <View style={styles.info}>
                <Text style={styles.nome}>
                  {item.nome || "Produto"}
                </Text>

                <Text style={styles.preco}>
                  R$ {item.preco || "0"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => removerItem(item.id)}
              >
                <Text style={styles.remover}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <Text style={styles.total}>
        Total: R$ {total.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030",
    padding: 16,
  },

  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#3a3a3a",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },

  placeholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#555",
  },

  info: {
    flex: 1,
  },

  nome: {
    color: "#fff",
    fontWeight: "bold",
  },

  preco: {
    color: "#A636E9",
    marginTop: 4,
  },

  remover: {
    color: "#ff4d4d",
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },

  total: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
});