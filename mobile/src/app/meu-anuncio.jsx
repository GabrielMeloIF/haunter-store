import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { useFocusEffect } from "expo-router";

import Header from "../components/header/index"
import { useAuth } from "../components/context/authContext";

export default function MeuAnuncio() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const { user } = useAuth();

  async function buscarProdutos() {
    if (!user) return;

    try {
      setLoading(true);
      setErro("");

      const response = await fetch(
        `http://192.168.56.1:4000/anuncios/usuario/${user.id_usuario}`
      );

      const data = await response.json();

      setProdutos(data);
    } catch (error) {
      console.log("Erro ao buscar produtos:", error);
      setErro("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      buscarProdutos();
    }, [user])
  );

  return (
    <View style={styles.container}>
      <Header />

      {loading && (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 20 }}
        />
      )}

      {erro ? (
        <Text style={styles.erro}>{erro}</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {produtos.map((item) => (
            <View key={item.id_anuncio} style={styles.card}>
              <Text style={styles.titulo}>
                {item.titulo}
              </Text>

              <Text style={styles.preco}>
                R$ {item.preco}
              </Text>
            </View>
          ))}

          {!loading && produtos.length === 0 && (
            <Text style={styles.semProdutos}>
              Nenhum anúncio encontrado
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a",
  },

  card: {
    backgroundColor: "#404040",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },

  titulo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  preco: {
    color: "#00ff99",
    fontSize: 16,
    marginTop: 5,
  },

  erro: {
    color: "red",
    marginTop: 20,
    textAlign: "center",
  },

  semProdutos: {
    color: "#fff",
    marginTop: 20,
    textAlign: "center",
  },
});