import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "../context/authContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [notificacao, setNotificacao] = useState(null); // { tipo: 'sucesso'|'erro', msg: '' }

  const mostrarNotificacao = (tipo, msg) => {
    setNotificacao({ tipo, msg });
    setTimeout(() => setNotificacao(null), 3000);
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      mostrarNotificacao("erro", "Preencha o email e a senha");
      return;
    }

    setCarregando(true);
    try {
      await login(email, senha);
      mostrarNotificacao("sucesso", "Login realizado com sucesso!");
      setTimeout(() => router.replace("/(tabs)"), 1000);
    } catch (error) {
      mostrarNotificacao("erro", error.message || "Email ou senha inválidos");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* Notificação */}
      {notificacao && (
        <View style={[
          styles.notificacao,
          notificacao.tipo === "sucesso" ? styles.notificacaoSucesso : styles.notificacaoErro
        ]}>
          <Text style={styles.notificacaoTexto}>{notificacao.msg}</Text>
        </View>
      )}

      <Text style={styles.title}>Entrar</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.inputs}
          placeholder="Email ou nome de usuário"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputs}
          placeholder="Senha"
          placeholderTextColor="#888"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={{ color: "#000" }}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, carregando && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={{ color: "#fff" }}>Logar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.registerText}>Ainda não possui conta?</Text>
      <Text style={styles.registerLink} onPress={() => router.push("/register")}>
        Crie uma já
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7D7D7D",
    alignItems: "center",
    justifyContent: "center",
    maxHeight: "100%",
    padding: 20,
    borderRadius: 30,
  },
  notificacao: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 12,
    zIndex: 99,
    alignItems: "center",
  },
  notificacaoSucesso: {
    backgroundColor: "#2ecc71",
  },
  notificacaoErro: {
    backgroundColor: "#e74c3c",
  },
  notificacaoTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },
  form: {
    width: "100%",
  },
  inputs: {
    padding: 10,
    backgroundColor: "#D9D9D9",
    marginBottom: 10,
    borderRadius: 30,
    color: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
    marginTop: 20,
  },
  backButton: {
    backgroundColor: "#D9D9D9",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: "#430883",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    minWidth: 80,
    alignItems: "center",
  },
  registerText: {
    marginTop: 20,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  registerLink: {
    color: "#691CA3",
    fontWeight: "bold",
  },
});