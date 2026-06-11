import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/header";
import { useRouter, useFocusEffect } from "expo-router";

const API_URL = "http://192.168.0.7:5000";

export default function Carrinho() {
  const [itens, setItens] = useState([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      carregarCarrinho();
    }, [])
  );

  const carregarCarrinho = async () => {
    try {
      const salvo = await AsyncStorage.getItem("carrinho");
      const ids = salvo ? JSON.parse(salvo) : [];

      if (ids.length === 0) {
        setItens([]);
        return;
      }

      const response = await fetch(`${API_URL}/produtos`);
      const todosProdutos = await response.json();

      // Conta quantas vezes cada ID aparece no carrinho
      const contagemIds = {};
      for (const id of ids.map(Number)) {
        contagemIds[id] = (contagemIds[id] || 0) + 1;
      }

      // Monta lista sem duplicatas, com quantidade correta
      const produtos = todosProdutos
        .filter((p) => contagemIds[Number(p.id)] > 0)
        .map((p) => ({
          ...p,
          id: Number(p.id),
          quantidade: contagemIds[Number(p.id)],
        }));

      setItens(produtos);
    } catch (error) {
      console.log("Erro ao carregar carrinho:", error);
    }
  };

  const salvarCarrinho = async (lista) => {
    const ids = lista.flatMap((p) =>
      Array(p.quantidade).fill(Number(p.id))
    );
    await AsyncStorage.setItem("carrinho", JSON.stringify(ids));
  };

  const removerItem = async (id) => {
    const novos = itens.filter((p) => Number(p.id) !== id);
    setItens(novos);
    await salvarCarrinho(novos);
  };

  const alterarQuantidade = async (id, delta) => {
    const novos = itens
      .map((p) =>
        Number(p.id) === id
          ? { ...p, quantidade: p.quantidade + delta }
          : p
      )
      .filter((p) => p.quantidade > 0);

    setItens(novos);
    await salvarCarrinho(novos);
  };

  const calcularTotal = () => {
    return itens.reduce((acc, p) => {
      return acc + Number(p.preco) * p.quantidade;
    }, 0);
  };

  const total = calcularTotal();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.content}>
        <Header />

        <View style={styles.main}>
          <Text style={styles.titulo}>Meu Carrinho</Text>

          {itens.length === 0 ? (
            <Text style={styles.vazio}>Seu carrinho está vazio.</Text>
          ) : (
            <>
              {itens.map((produto) => (
                <View key={produto.id} style={styles.card}>
                  <Image
                    source={{ uri: produto.imagem_url }}
                    style={styles.imagem}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.nome}>{produto.nome}</Text>

                    <Text style={styles.descricao}>{produto.descricao}</Text>

                    <Text style={styles.preco}>R$ {produto.preco}</Text>
                  </View>

                  <View style={styles.qtdContainer}>
                    <TouchableOpacity
                      onPress={() => alterarQuantidade(produto.id, -1)}
                      style={styles.btnQtd}
                    >
                      <Text style={styles.btnTexto}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtd}>{produto.quantidade}</Text>

                    <TouchableOpacity
                      onPress={() => alterarQuantidade(produto.id, 1)}
                      style={styles.btnQtd}
                    >
                      <Text style={styles.btnTexto}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={() => removerItem(produto.id)}>
                    <Text style={styles.remover}>Remover</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.resumo}>
                <Text style={styles.resumoTitulo}>Total</Text>

                <Text style={styles.total}>
                  R$ {total.toFixed(2).replace(".", ",")}
                </Text>

                <TouchableOpacity
                  style={styles.btnFinalizar}
                  onPress={() => router.push("/pagamento")}
                >
                  <Text style={styles.btnTexto}>Finalizar compra</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },

  content: {
    flex: 1,
  },

  main: {
    padding: 16,
  },

  titulo: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  vazio: {
    color: "#fff",
    textAlign: "center",
    marginTop: 40,
  },

  card: {
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  imagem: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },

  nome: {
    color: "#fff",
    fontWeight: "bold",
  },

  descricao: {
    color: "#ccc",
    fontSize: 12,
  },

  preco: {
    color: "#A636E9",
    fontWeight: "bold",
  },

  qtdContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  btnQtd: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  qtd: {
    color: "#fff",
  },

  remover: {
    color: "red",
    marginLeft: 10,
  },

  resumo: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: "#555",
    paddingTop: 10,
  },

  resumoTitulo: {
    color: "#fff",
    fontSize: 18,
  },

  total: {
    color: "#A636E9",
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },

  btnFinalizar: {
    backgroundColor: "#A636E9",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  btnTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});