import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/header";
import NavBar from "../components/navbar";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

export default function Comprar() {
  const router = useRouter();

  const [produtos, setProdutos] = useState([
    {
      id: 1,
      nome: "Mouse Fortrek Spider",
      descricao:
        "Eleve sua experiência nos jogos e no dia a dia com design ergonômico.",
      preco: "R$ 79,00",
      imagens: [
        require("../../assets/mouse 1.png"),
        require("../../assets/headset 1.png"),
        require("../../assets/teclado 1.png"),
      ],
      comentario: "Muito bom!",
      estrelas: 4,
    },
  ]);

  const [favoritos, setFavoritos] = useState([]);
  const [rating, setRating] = useState(0);
  const [novoComentario, setNovoComentario] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [toast, setToast] = useState(false);

  const produto = produtos[0];

  useEffect(() => {
    carregarFavoritos();
  }, []);

  const carregarFavoritos = async () => {
    const salvo = await AsyncStorage.getItem("favoritos");
    setFavoritos(salvo ? JSON.parse(salvo) : []);
  };

  const toggleFavorito = async (id) => {
    const novos = favoritos.includes(id)
      ? favoritos.filter((f) => f !== id)
      : [...favoritos, id];

    setFavoritos(novos);
    await AsyncStorage.setItem("favoritos", JSON.stringify(novos));
  };

  const adicionarAoCarrinho = async () => {
    const salvo = await AsyncStorage.getItem("carrinho");
    const ids = salvo ? JSON.parse(salvo) : [];

    ids.push(produto.id);

    await AsyncStorage.setItem("carrinho", JSON.stringify(ids));
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const adicionarComentario = () => {
    if (!novoComentario.trim()) return;

    const novo = {
      ...produto,
      id: Date.now(),
      comentario: novoComentario,
      estrelas: rating,
    };

    setProdutos([...produtos, novo]);
    setNovoComentario("");
    setRating(0);
  };

  const calculoRating = () => {
    const total = produtos.reduce((acc, p) => acc + p.estrelas, 0);
    return Math.round(total / produtos.length);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      {toast && (
        <View
          style={{
            position: "absolute",
            bottom: 40,
            alignSelf: "center",
            backgroundColor: "#A636E9",
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 99,
            zIndex: 999,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            ✓ Produto adicionado ao carrinho!
          </Text>
        </View>
      )}
      <View style={styles.content}>
        <Header />
        <NavBar />

        {/* IMAGENS */}
        <View style={styles.imageContainer}>
          <Image
            source={produto.imagens[currentImage]}
            style={styles.mainImg}
          />

          <View style={styles.thumbRow}>
            <TouchableOpacity
              onPress={() =>
                setCurrentImage(
                  currentImage === 0
                    ? produto.imagens.length - 1
                    : currentImage - 1,
                )
              }
            >
              <Text style={styles.arrow}>{"<"}</Text>
            </TouchableOpacity>

            {produto.imagens.map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentImage(index)}
              >
                <Image
                  source={img}
                  style={[
                    styles.thumb,
                    index === currentImage && styles.thumbActive,
                  ]}
                />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() =>
                setCurrentImage((currentImage + 1) % produto.imagens.length)
              }
            >
              <Text style={styles.arrow}>{">"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DETALHES */}
        <View style={styles.card}>
          <Text style={styles.nome}>{produto.nome}</Text>

          {/* estrelas */}
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text
                key={star}
                style={[styles.star, star <= rating && { color: "yellow" }]}
                onPress={() => setRating(star)}
              >
                ★
              </Text>
            ))}
          </View>

          <Text style={styles.desc}>{produto.descricao}</Text>
          <Text style={styles.preco}>{produto.preco}</Text>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.btn} onPress={adicionarAoCarrinho}>
              <Text style={styles.btnText}>Adicionar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn}>
              <Text
                style={styles.btnText}
                onPress={() => router.push("/finalizar")}
              >
                Comprar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAVORITO */}
        <TouchableOpacity
          onPress={() => toggleFavorito(produto.id)}
          style={styles.fav}
        >
          <Text style={{ fontSize: 30 }}>
            {favoritos.includes(produto.id) ? (
              <AntDesign name="star" size={24} color="yellow" />
            ) : (
              "☆"
            )}
          </Text>
          <Text style={{ color: "#fff" }}>Favoritar</Text>
        </TouchableOpacity>

        {/* COMENTÁRIOS */}
        <View style={styles.comentarios}>
          <Text style={styles.titulo}>Comentários</Text>

          <View style={styles.inputRow}>
            <TextInput
              value={novoComentario}
              onChangeText={setNovoComentario}
              placeholder="Escreva..."
              style={styles.input}
            />

            <TouchableOpacity onPress={adicionarComentario} style={styles.btn}>
              <Text style={styles.btnText}>Enviar</Text>
            </TouchableOpacity>
          </View>

          {produtos.map((p) => (
            <View key={p.id} style={styles.comentario}>
              <Text style={{ color: "#fff" }}>{p.comentario}</Text>
              <Text style={styles.estrela}>
                {p.estrelas} <AntDesign name="star" size={24} color="yellow" />
              </Text>
            </View>
          ))}

          <Text style={{ color: "#fff", marginTop: 10 }}>
            Média: {calculoRating()}{" "}
            <AntDesign name="star" size={24} color="yellow" />
          </Text>
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

  /* IMAGENS */
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  mainImg: {
    width: 280,
    height: 220,
    borderRadius: 12,
  },

  thumbRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  thumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginHorizontal: 5,
    opacity: 0.6,
  },

  thumbActive: {
    borderWidth: 2,
    borderColor: "#A636E9",
    opacity: 1,
  },

  arrow: {
    color: "#fff",
    fontSize: 22,
    marginHorizontal: 10,
  },

  /* CARD PRODUTO */
  card: {
    backgroundColor: "#2a2a2a",
    marginHorizontal: 16,
    marginTop: 20,
    padding: 18,
    borderRadius: 14,
  },

  nome: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  desc: {
    color: "#aaa",
    marginTop: 10,
    lineHeight: 20,
  },

  preco: {
    color: "#A636E9",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
  },

  /* ESTRELAS */
  stars: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },

  star: {
    fontSize: 26,
    color: "#444",
    marginRight: 5,
  },

  estrela: {
    display: "flex",
    alignItems: "center",
    fontSize: 18,
    marginLeft: 5,
  },

  /* BOTÕES */
  btnRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },

  btn: {
    flex: 1,
    backgroundColor: "#A636E9",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  /* FAVORITO */
  fav: {
    alignItems: "center",
    marginTop: 20,
  },

  /* COMENTÁRIOS */
  comentarios: {
    backgroundColor: "#2a2a2a",
    margin: 16,
    padding: 16,
    borderRadius: 14,
  },

  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },

  inputRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#3a3a3a",
    padding: 10,
    borderRadius: 8,
    color: "#fff",
  },

  comentario: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#3a3a3a",
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
});
