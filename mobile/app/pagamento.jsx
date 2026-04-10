import Header from "../src/components/header";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

export default function Finalizar() {
  const [formaSelecionada, setFormaSelecionada] = useState("Crédito");
  const [parcela, setParcela] = useState("1x");
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header />

      {/* título */}
      <View style={styles.tituloBox}>
        <MaterialIcons
          name="credit-card"
          size={28}
          color="#A636E9"
          style={styles.icon}
        />
        <Text style={styles.titulo}>Forma de pagamento</Text>
      </View>

      {/* opções de pagamento */}
      <View style={styles.opcoes}>
        {["Crédito", "Débito", "Boleto"].map((opcao) => (
          <TouchableOpacity
            key={opcao}
            style={[
              styles.opcao,
              formaSelecionada === opcao && styles.opcaoSelecionada,
            ]}
            onPress={() => setFormaSelecionada(opcao)}
          >
            <Text style={styles.opcaoText}>{opcao}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* formulário dinâmico */}
      <View style={styles.formulario}>
        {formaSelecionada === "Crédito" && (
          <>
            <Text style={styles.label}>Número do cartão</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Nome no cartão</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Gabriel Silva"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Validade</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/AA"
              keyboardType="numeric"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              keyboardType="numeric"
              secureTextEntry={true}
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Parcelas</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={parcela}
                onValueChange={(itemValue) => setParcela(itemValue)}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                <Picker.Item label="1x de R$ 120,00 (sem juros)" value="1x" />
                <Picker.Item label="2x de R$ 60,00 (sem juros)" value="2x" />
                <Picker.Item label="3x de R$ 40,00 (sem juros)" value="3x" />
                <Picker.Item label="4x de R$ 30,00 (sem juros)" value="4x" />
              </Picker>
            </View>
          </>
        )}

        {formaSelecionada === "Débito" && (
          <>
            <Text style={styles.label}>Número do cartão</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Nome no cartão</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Gabriel Silva"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Validade</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/AA"
              keyboardType="numeric"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Banco</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Itaú, Bradesco..."
              placeholderTextColor="#666"
            />
          </>
        )}

        {formaSelecionada === "Boleto" && (
          <>
            <Text style={styles.label}>Boleto bancário</Text>
            <Text style={{ color: "#ccc", marginBottom: 20 }}>
              Ao finalizar, o boleto será gerado com vencimento em 3 dias úteis.
            </Text>
          </>
        )}
      </View>

      {/* botões */}
      <View style={styles.btnBox}>
        <TouchableOpacity style={styles.btnSecundario}>
          <Text style={styles.btnTextSecundario} onPress={() => router.push("/finalizar")}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPrimario}>
          <Text style={styles.btnText} onPress={() => router.push("/confirmacao")}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#303030"},
  tituloBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 16,
  },
  icon: { marginRight: 8 },
  titulo: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  opcoes: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
  },
  opcao: {
    backgroundColor: "#363636",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  opcaoSelecionada: { backgroundColor: "#A636E9" },
  opcaoText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  formulario: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    width: "85%",
    alignSelf: "center",
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#A636E9",
  },
  label: { color: "#fff", marginBottom: 6, fontSize: 14, fontWeight: "600",  },
  input: {
        backgroundColor: "#D9D9D9",
        borderRadius: 8,
        height: 40,
        fontSize: 14,
        paddingHorizontal: 10,
        marginBottom: 20,
        color: "#333",
  },
  btnBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    alignSelf: "center",
    marginBottom: 20,
  },
  btnPrimario: {
    backgroundColor: "#A636E9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  btnSecundario: {
    backgroundColor: "#555",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnTextSecundario: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
