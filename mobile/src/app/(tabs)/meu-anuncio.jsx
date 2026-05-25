import React, { useState, useCallback } from "react";
import {View,StyleSheet,Text,} from "react-native";
import { useFocusEffect } from "expo-router";
import Header from "../../components/header";
import { useAuth } from "../../components/context/authContext";

export default function MeuAnuncio() {
  const [produtos, setProdutos] = useState([]);
  const { user } = useAuth();

  async function buscarProdutos() {
    try {
      const response = await fetch(
        `http://192.168.56.1:4000/anuncios/usuario/${user.id_usuario}`
      );
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      buscarProdutos();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030",
    padding: 20,
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
});