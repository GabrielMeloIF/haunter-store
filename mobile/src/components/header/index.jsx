import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";

import { useAuth } from "../context/authContext";
import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { useUser } from "../context/userContext";
import { useSearch } from "../context/searchContext";

const Logo = require("../../../assets/logo.png");

export default function Header() {
  const router = useRouter();

  const { usuario, estaLogado } = useAuth();
  const [textoBusca, setTextoBusca] = useState("");
  const { setBusca } = useSearch();

  const [showSearch, setShowSearch] = useState(false);

  const { width } = useWindowDimensions();
  const isMobile = width < 1024;

  const handleBuscar = () => {
  if (!textoBusca.trim()) return;

  setBusca(textoBusca.trim());
  router.push({
    pathname: "/pesquisa",
    params: {
      q: textoBusca.trim(),
    },
  });
};

  return (
    <View style={styles.header}>
      <View style={styles.side}>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
          <EvilIcons name="search" size={20} color="white" />
        </TouchableOpacity>

        {showSearch && (
          <TextInput
            style={styles.input}
            placeholder="Digite sua busca..."
            placeholderTextColor="#ddd"
            value={textoBusca}
            onChangeText={setTextoBusca}
            onSubmitEditing={handleBuscar}
          />
        )}
      </View>

      <TouchableOpacity onPress={() => router.push("/(tabs)")}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </TouchableOpacity>

      <View style={[styles.side, { justifyContent: "flex-end" }]}>
        <TouchableOpacity
          style={styles.userBtn}
          onPress={() => router.push(estaLogado ? "/(tabs)/user" : "/login")}
        >
          {estaLogado && usuario?.foto ? (
            <Image source={{ uri: usuario.foto }} style={styles.userImage} />
          ) : (
            <Feather name="user" size={15} color="white" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.anunciarBtn}
          onPress={() =>
            router.push(estaLogado ? "/anunciar" : "/(tabs)/user")
          }
        >
          <Feather name="plus-circle" size={20} color="white" />
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
    height: 90,
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
    marginTop: 30,
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
    borderRadius: 9,
    padding: 12,
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
    marginTop: 25,
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
