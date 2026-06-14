import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import Header from "../../components/header/index";
import { useAds } from "../../components/context/AdsContext";

export default function MeuAnuncio() {
  const { ads, deleteAd } = useAds();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        {ads.length === 0 ? (
          <Text style={styles.semProdutos}>Nenhum anúncio encontrado</Text>
        ) : (
          ads.map((item) => (
            <View key={item.id} style={styles.card}>
              {item.photos?.[0] ? (
                <Image
                  source={{ uri: item.photos[0] }}
                  style={styles.imagem}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagemVazia}>
                  <Text style={styles.imagemVaziaTexto}>Sem imagem</Text>
                </View>
              )}

              <View style={styles.cardBody}>
                <Text style={styles.titulo}>{item.title}</Text>
                <Text style={styles.preco}>R$ {item.price}</Text>
                <Text style={styles.cidade}>{item.city}</Text>

                <View style={styles.botoesRow}>
                  <TouchableOpacity
                    style={styles.botaoDeletar}
                    onPress={() => {
                      console.log("ITEM COMPLETO:", item);
                      deleteAd(item.id, item.produtoId);
                    }}
                  >
                    <Text style={styles.botaoDeletarTexto}>🗑️ Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
    borderRadius: 10,
    marginTop: 15,
    marginHorizontal: 15,
    overflow: "hidden",
  },

  imagem: {
    width: "100%",
    height: 180,
  },

  imagemVazia: {
    width: "100%",
    height: 120,
    backgroundColor: "#2a2a3a",
    alignItems: "center",
    justifyContent: "center",
  },

  imagemVaziaTexto: {
    color: "#666",
    fontSize: 13,
  },

  cardBody: {
    padding: 15,
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

  cidade: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 4,
  },

  botoesRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  botaoEditar: {
    flex: 1,
    backgroundColor: "#A636E9",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },

  botaoEditarTexto: {
    color: "#fff",
    fontWeight: "bold",
  },

  botaoDeletar: {
    flex: 1,
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },

  botaoDeletarTexto: {
    color: "#fff",
    fontWeight: "bold",
  },

  semProdutos: {
    color: "#fff",
    marginTop: 20,
    textAlign: "center",
  },
});
