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
import Feather from '@expo/vector-icons/Feather';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
 
const Logo = require("../../assets/logo.png");
 
export default function Header() {
  const [busca, setBusca] = useState("");
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

          {/* hamburguer */}
          <View>
            <AntDesign name="bars" size={24} color="white" />
          </View>

 
      {/*  busca */}
      <View style={styles.side}>
        <TouchableOpacity onPress={handleBuscar}>
          <EvilIcons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

    {/*  logo */}
      <TouchableOpacity>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </TouchableOpacity>
 
      {/* ícones */}
      <View style={[styles.side, { justifyContent: "flex-end" }]}>
 
        {isMobile && (
          <TouchableOpacity style={styles.navIcon}>
            <Feather name="shopping-cart" size={24} color="white" />
          </TouchableOpacity>
        )}
 
        {!isMobile && (
          <>
            {["Meus anúncios", "Mensagens", "Notificações", "Carrinho"].map((item) => (
              <TouchableOpacity key={item} style={styles.navLink}>
                <Text style={styles.navLinkText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
 
        <TouchableOpacity style={styles.userBtn}>
          <Feather name="user" size={20} color="white" />
        </TouchableOpacity>
 
        <TouchableOpacity style={styles.anunciarBtn}>
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
  side: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    marginRight: 30,
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
 
});