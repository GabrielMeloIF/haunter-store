import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from "react-native";
 
import Logo from "../../../assets/logo.png";

import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
 
export default function Footer() {
  const openLink = (url) => {
    Linking.openURL(url);
  };
 
  return (
    <View style={styles.footer}>
 
      {/* Logo */}
      <TouchableOpacity onPress={() => {}} style={styles.logoContainer}>
    
         <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </TouchableOpacity>
 
      {/* Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => openLink("/contact")}>
          <Text style={styles.linkText}>Ajuda</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink("/contact")}>
          <Text style={styles.linkText}>Fale conosco</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink("/contact")}>
          <Text style={styles.linkText}>Termos de uso</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink("/contact")}>
          <Text style={styles.linkText}>Política de privacidade</Text>
        </TouchableOpacity>
      </View>
 
      {/* Redes sociais + Copyright */}
      <View style={styles.socialContainer}>
        <TouchableOpacity
          onPress={() => openLink("https://www.facebook.com/?locale=pt_BR")}
          style={styles.iconButton}
        >
          <FontAwesome5 name="facebook" size={22} color="#1877F2" />
        </TouchableOpacity>
 
        <TouchableOpacity
          onPress={() => openLink("https://www.instagram.com/")}
          style={styles.iconButton}
        >
          <FontAwesome name="instagram" size={22} color="#9D174D" />
        </TouchableOpacity>
 
        <Text style={styles.copyright}>© 2026 Haunter Store.</Text>
      </View>
 
    </View>
  );
}
 
const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#A636E9",
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
    gap: 12,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 64,
    height: 64,
    padding: 8,
  },
  logoPlaceholder: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  linksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  linkText: {
    color: "#fff",
    fontSize: 12,
  },
  socialContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  copyright: {
    color: "#fff",
    fontSize: 12,
  },
});