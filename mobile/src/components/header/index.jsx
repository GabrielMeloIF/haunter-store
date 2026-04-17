import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import EvilIcons from "@expo/vector-icons/EvilIcons";

import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { useUser } from "../../components/context/userContext";
const Logo = require("../../../assets/logo.png");

export default function Header() {
  const router = useRouter();

  const { userImage } = useUser();

  const [busca, setBusca] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 1024;

  const handleBuscar = () => {
    const query = busca.trim().toLowerCase();
    if (!query) return;
    console.log("Buscar:", query);
    setBusca("");
  };

  return (
    <View style={styles.header}>
      {/*  busca */}

      <View style={styles.side}>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
          <EvilIcons name="search" size={20} color="white" />
        </TouchableOpacity>
        {showSearch && (
          <TextInput
            style={styles.input}
            placeholder="Digite sua busca..."
            placeholderTextColor="#ddd"
            value={busca}
            onChangeText={setBusca}
            onSubmitEditing={handleBuscar}
          />
        )}
      </View>

      {/*  logo */}
      <TouchableOpacity onPress={() => router.push("/")}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </TouchableOpacity>

      {/* ícones */}
      <View style={[styles.side, { justifyContent: "flex-end" }]}>
        {!isMobile && (
          <>
            {["Meus anúncios", "Mensagens", "Notificações", "Carrinho"].map(
              (item) => (
                <TouchableOpacity key={item} style={styles.navLink}>
                  <Text style={styles.navLinkText}>{item}</Text>
                </TouchableOpacity>
              ),
            )}
          </>
        )}

        <TouchableOpacity
          style={styles.userBtn}
          onPress={() => router.push("/register")}
        >
          {userImage ? (
            <Image source={{ uri: userImage }} style={styles.userImage} />
          ) : (
            <Feather name="user" size={20} color="white" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.anunciarBtn}
          onPress={() => router.push("/anunciar")}
        >
          <Feather name="plus-circle" size={20} color="white" />
          {!isMobile && <Text style={styles.anunciarText}>Anunciar</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#A636E9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: "100%",
  },
  userImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  side: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    marginRight: 5,
    width: 48,
    height: 48,
  },
  navIcon: {
    padding: 4,
  },
  navLink: {
    padding: 4,
  },
  navLinkText: {
    color: "#fff",
    fontSize: 14,
  },
  userBtn: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  anunciarBtn: {
    backgroundColor: "#430883",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  anunciarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  side: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },

  input: {
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
    width: 140,
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    color: "#fff",
    fontSize: 13,
  },
});
