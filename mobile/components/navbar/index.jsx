import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
 
const links = [
  { label: "Favoritos", href: "/favoritos" },
  { label: "Periféricos", href: "/perifericos" },
  { label: "Jogos", href: "/jogos" },
];
 
export default function NavBar() {
  const handleNav = (href) => {
    // Troque pelo seu router, ex: router.push(href)
    console.log("Navegar para:", href);
  };
 
  return (
    <View style={styles.nav}>
      {links.map((link) => (
        <TouchableOpacity
          key={link.href}
          style={styles.item}
          onPress={() => handleNav(link.href)}
          activeOpacity={0.7}
        >
          <Text style={styles.text}>{link.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
 
const styles = StyleSheet.create({
  nav: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  text: {
    color: "#fff",
    fontSize: 14,
  },
});