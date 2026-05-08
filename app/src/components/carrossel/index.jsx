import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

const slides = [
  {
    id: 1,
    image: require("../../../assets/promo.png"),
    titulo: "Promoção!!",
    descricao: "Venha aproveitar nossas promoções",
  },
  {
    id: 2,
    image: require("../../../assets/forza.png"),
    titulo: "Forza Horizon 6",
    descricao:
      "Explore o Japão em um mundo aberto com paisagens incríveis, dirija mais de 550 carros reais e construa sua fama para se tornar uma lenda das corridas.",
  },
  {
    id: 3,
    image: require("../../../assets/fortinite.png"),
    titulo: "Fortnite",
    descricao:
      "Viaje para uma nova ilha, explore novas formas de jogar e aproveite um Passe de Batalha cheio de recompensas.",
  },
  {
    id: 4,
    image: require("../../../assets/god-of-war.png"),
    titulo: "God of War",
    descricao:
      "Batalhas épicas com gráficos impressionantes. Kratos busca vingança contra os Deuses que o traíram.",
  },
];

const categories = [
  { icon: "headphones", lib: "feather", label: "Periféricos" },
  { icon: "store", lib: "material", label: "Loja", sublabel: "100% Oficial" },
  { icon: "gamepad-variant", lib: "material", label: "Games" },
  {
    icon: "shield-outline",
    lib: "material",
    label: "Experiência",
    sublabel: "Segura e simples",
  },
];

function CategoryIcon({ icon, lib }) {
  if (lib === "feather")
    return <Feather name={icon} size={40} color="#6b7280" />;
  if (lib === "material")
    return <MaterialCommunityIcons name={icon} size={40} color="#6b7280" />;
  return <Ionicons name={icon} size={40} color="#6b7280" />;
}

export default function Carrossel() {
  const [atual, setAtual] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;
  const { width } = useWindowDimensions();

  const irPara = (index) => {
    if (index === atual) return;
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => setAtual(index), 200);
  };

      useEffect(() => {
    const interval = setInterval(() => {
      proximo();
    }, 3000); // troca a cada 3 segundos

    return () => clearInterval(interval);
  }, [atual]);

  const proximo = () => irPara((atual + 1) % slides.length);
  const anterior = () => irPara((atual - 1 + slides.length) % slides.length);

  const slide = slides[atual];

  return (
    <View style={styles.container}>
      {/* Carrossel */}
      <View style={[styles.carrossel, { width: width - 32 }]}>
        <Animated.View style={[styles.imageWrapper, { opacity }]}>
          <Image source={slide.image} style={styles.image} resizeMode="cover" />

          {/* Overlay gradiente */}
          <View style={styles.overlay} />

          {/* Texto */}
          <View style={styles.textContainer}>
            <Text style={styles.titulo}>{slide.titulo}</Text>
            <Text style={styles.descricao}>{slide.descricao}</Text>
          </View>
        </Animated.View>

        {/* Botão Anterior */}
        <TouchableOpacity
          style={[styles.navBtn, { left: 12 }]}
          onPress={anterior}
        >
          <Feather name="chevron-left" size={20} color="white" />
        </TouchableOpacity>

        {/* Botão Próximo */}
       <TouchableOpacity 
  style={[styles.navBtn, { right: 12 }]}
  onPress={proximo}
>
          <Feather name="chevron-right" size={20} color="white" />
        </TouchableOpacity>

        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => irPara(i)}
              style={[
                styles.dot,
                i === atual ? styles.dotAtivo : styles.dotInativo,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Categorias */}
          <View style={styles.categorias}>
        {categories.map((cat, index) => (
          <TouchableOpacity key={index} style={styles.categoryItem}>
            <View style={styles.categoryCircle}>
              <CategoryIcon icon={cat.icon} lib={cat.lib} />
            </View>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
            {cat.sublabel && (
              <Text style={styles.categorySublabel}>{cat.sublabel}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  carrossel: {
    borderWidth: 1,
    borderColor: "#6b21a8",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 20,
    aspectRatio: 16 / 9,
  },
  imageWrapper: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  textContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    padding: 16,
  },
  titulo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  descricao: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
  navBtn: {
    position: "absolute",
    top: "50%",
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  dots: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotAtivo: {
    width: 20,
    backgroundColor: "#fff",
  },
  dotInativo: {
    width: 6,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  categories: {
    flexDirection: "row",
    gap: 24,
    marginTop: 24,
    paddingHorizontal: 8,
  },
  categoryItem: {
    alignItems: "center",
  },
  categoryCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 6,
    textAlign: "center",
  },
  categorySublabel: {
    color: "#fff",
    fontSize: 11,
    textAlign: "center",
  },
  categorias:{
    flexDirection: "row",
    gap: 20,
    marginTop: 24,
  }
});
