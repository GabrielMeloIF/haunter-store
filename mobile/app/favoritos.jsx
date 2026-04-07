import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../src/components/header";
import NavBar from "../src/components/navbar";
import Footer from "../src/components/footer";
import { todosProdutos } from "../produtos";

export default function Favoritos() {
  const [produtosFavoritos, setProdutosFavoritos] = useState([]);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  const carregarFavoritos = async () => {
    const salvo = await AsyncStorage.getItem("favoritos");
    const ids = salvo ? JSON.parse(salvo) : [];
    setProdutosFavoritos(todosProdutos.filter((p) => ids.includes(p.id)));
  };

  const removerFavorito = async (id) => {
    const novos = produtosFavoritos.filter((p) => p.id !== id);
    setProdutosFavoritos(novos);
    await AsyncStorage.setItem(
      "favoritos",
      JSON.stringify(novos.map((p) => p.id))
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.content}>
        
        <Header />
        <NavBar />

        <View style={styles.main}>
          <Text style={styles.titulo}>Favoritos</Text>

          {produtosFavoritos.length === 0 ? (
            <Text style={styles.vazio}>Nenhum favorito ainda.</Text>
          ) : (
            <View style={styles.grid}>
              {produtosFavoritos.map((produto) => (
                <View key={produto.id} style={styles.card}>
                  <Image
                    source={produto.imagem}
                    style={styles.imagem}
                    resizeMode="cover"
                  />
                  <Text style={styles.nome}>{produto.nome}</Text>
                  <Text style={styles.descricao}>
                    {produto.descricao}
                  </Text>
                  <Text style={styles.preco}>{produto.preco}</Text>

                  <View style={styles.botoes}>
                    <TouchableOpacity
                      style={styles.btnRemover}
                      onPress={() => removerFavorito(produto.id)}
                    >
                      <Text style={styles.btnTexto}>Remover</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnComprar}>
                      <Text style={styles.btnTexto}>Comprar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
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
    paddingBottom: 20,
  },

  titulo: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 32,
    marginBottom: 16,
  },

  vazio: {
    color: "#fff",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    padding: 16,
  },

  card: {
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 10,
    padding: 12,
    width: 300,
  },

  imagem: {
    width: "100%",
    height: 180,
    borderRadius: 6,
  },

  nome: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
  },

  descricao: {
    color: "#ccc",
    marginTop: 4,
  },

  preco: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 8,
  },

  botoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  btnRemover: {
    flex: 1,
    backgroundColor: "#dc2626",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },

  btnComprar: {
    backgroundColor: "#A636E9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },

  btnTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});