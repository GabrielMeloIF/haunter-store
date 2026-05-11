import { View, Text, StyleSheet } from "react-native";

export default function TesteScroll() {
  return (
    <View style={{
      display: "flex",
      flexDirection: "row",
      overflowX: "scroll",
      gap: 12,
      padding: 16,
      backgroundColor: "#222",
    }}>
      {[1,2,3,4,5].map((n) => (
        <View key={n} style={{
          minWidth: 200,
          height: 200,
          backgroundColor: "#A636E9",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "#fff",    
          fontSize: 24,
        }}>
          Card {n}
        </View>
      ))}
    </View>
  );
}