import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/header/index";
import { useRouter, useFocusEffect } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function MinhasCompras() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useFocusEffect(
    useCallback(() => {
      carregarUsuarioEPedidos();
    }, [])
  );

  const carregarUsuarioEPedidos = async () => {
    try {
      setLoading(true);
      setErro(null);

      const usuarioSalvo = await AsyncStorage.getItem("usuario");
      const user = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
      setUsuario(user);

      if (!user) {
        setLoading(false);
        return;
      }

      const id = user.id_usuario ?? user.id;
      const response = await fetch(`${API_URL}/pedidos/usuario/${id}`);

      if (!response.ok) throw new Error("Erro ao buscar pedidos");

      const data = await response.json();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Erro ao carregar pedidos:", err);
      setErro("Não foi possível carregar seus pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataStr) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR");
  };

  const formatarPreco = (valor) => {
    return Number(valor).toFixed(2).replace(".", ",");
  };

  // Sem login
  if (!loading && !usuario) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.centralizador}>
          <Text style={styles.textoVazio}>
            Faça login para ver suas compras.
          </Text>
          <TouchableOpacity
            style={styles.btnPrimario}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.btnPrimarioTexto}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <Header />

      <View style={styles.main}>
        <Text style={styles.titulo}>Suas Compras</Text>

        {loading ? (
          <View style={styles.centralizador}>
            <ActivityIndicator size="large" color="#A636E9" />
            <Text style={styles.textoVazio}>Carregando seus pedidos...</Text>
          </View>
        ) : erro ? (
          <View style={styles.centralizador}>
            <Text style={styles.textoErro}>{erro}</Text>
          </View>
        ) : pedidos.length === 0 ? (
          <View style={styles.centralizador}>
            <Text style={styles.textoVazio}>Você ainda não tem pedidos.</Text>
            <TouchableOpacity
              style={styles.btnPrimario}
              onPress={() => router.push("/(tabs)")}
            >
              <Text style={styles.btnPrimarioTexto}>Ir para a loja</Text>
            </TouchableOpacity>
          </View>
        ) : (
          pedidos.map((pedido) => (
            <View key={pedido.id_pedido} style={styles.cardPedido}>
              {/* Cabeçalho do pedido */}
              <View style={styles.pedidoHeader}>
                <View>
                  <Text style={styles.pedidoNumero}>
                    Pedido #{pedido.id_pedido}
                  </Text>
                  <Text style={styles.pedidoData}>
                    {formatarData(pedido.data_pedido)}
                  </Text>
                </View>
                <View style={styles.pedidoHeaderDireita}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeTexto}>{pedido.status}</Text>
                  </View>
                  <Text style={styles.pedidoTotal}>
                    R$ {formatarPreco(pedido.valor_total)}
                  </Text>
                </View>
              </View>

              {/* Itens do pedido */}
              {pedido.itempedido?.map((item) => (
                <View key={item.id_item} style={styles.cardItem}>
                  <Image
                    source={{
                      uri: item.produto?.imagem_url || null,
                    }}
                    style={styles.imagem}
                    defaultSource={require("../../assets/logo.png")}
                  />

                  <View style={styles.itemInfo}>
                    <Text style={styles.itemNome}>{item.produto?.nome}</Text>
                    <Text style={styles.itemQtd}>
                      Quantidade: {item.quantidade}
                    </Text>
                    <Text style={styles.itemPreco}>
                      R$ {formatarPreco(item.preco_unitario)}
                    </Text>
                  </View>

                  <View style={styles.itemBotoes}>
                    <TouchableOpacity
                      style={styles.btnSecundario}
                      onPress={() =>
                        router.push({
                          pathname: "/comprar",
                          params: {
                            id: item.produto?.id,
                            nome: item.produto?.nome,
                            preco: item.produto?.preco,
                            descricao: item.produto?.descricao,
                            imagem: item.produto?.imagem_url,
                          },
                        })
                      }
                    >
                      <Text style={styles.btnSecundarioTexto}>Avaliar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnSecundario}
                      onPress={() =>
                        router.push({
                          pathname: "/comprar",
                          params: {
                            id: item.produto?.id,
                            nome: item.produto?.nome,
                            preco: item.produto?.preco,
                            descricao: item.produto?.descricao,
                            imagem: item.produto?.imagem_url,
                          },
                        })
                      }
                    >
                      <Text style={styles.btnSecundarioTexto}>
                        Comprar novamente
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a",
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
    marginTop: 10,
  },

  centralizador: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    gap: 16,
  },

  textoVazio: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },

  textoErro: {
    color: "#f87171",
    fontSize: 16,
    textAlign: "center",
  },

  btnPrimario: {
    backgroundColor: "#A636E9",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  btnPrimarioTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  cardPedido: {
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3b1d6e",
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },

  pedidoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  pedidoNumero: {
    color: "#aaa",
    fontSize: 13,
  },

  pedidoData: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 2,
  },

  pedidoHeaderDireita: {
    alignItems: "flex-end",
    gap: 6,
  },

  badge: {
    backgroundColor: "#3b1d6e",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeTexto: {
    color: "#d8b4fe",
    fontSize: 12,
    fontWeight: "bold",
  },

  pedidoTotal: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  cardItem: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },

  imagem: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    backgroundColor: "#2a2a3e",
  },

  itemInfo: {
    gap: 4,
  },

  itemNome: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  itemQtd: {
    color: "#aaa",
    fontSize: 13,
  },

  itemPreco: {
    color: "#A636E9",
    fontWeight: "bold",
    fontSize: 14,
  },

  itemBotoes: {
    flexDirection: "row",
    gap: 8,
  },

  btnSecundario: {
    flex: 1,
    backgroundColor: "#A636E9",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  btnSecundarioTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});