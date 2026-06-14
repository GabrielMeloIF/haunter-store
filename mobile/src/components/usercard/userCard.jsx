import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/authContext";
import Feather from "@expo/vector-icons/Feather";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.8:5000";

export default function UserCard() {
  const router = useRouter();
  const {
    usuario,
    token,
    logout,
    estaLogado,
    atualizarUsuario: atualizarContext,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [notificacao, setNotificacao] = useState(null);
  const [confirmandoLogout, setConfirmandoLogout] = useState(false);
  const [confirmandoDeletar, setConfirmandoDeletar] = useState(false);

  const mostrarNotificacao = (tipo, msg) => {
    setNotificacao({ tipo, msg });
    setTimeout(() => setNotificacao(null), 3000);
  };

  useEffect(() => {
    if (usuario) {
      setEmail(usuario.email || "");
      setNome(usuario.nome || "");
      setImageUri(usuario.foto || null);
    }
  }, [usuario]);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const base64Uri = `data:image/jpeg;base64,${asset.base64}`;
      setImageUri(base64Uri);
    }
  };

  const salvarUsuario = async () => {
    if (!usuario || !token) return;

    try {
      const response = await fetch(`${API_URL}/users/${usuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          email,
          foto: imageUri,
          ...(senha ? { senha } : {}),
        }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar");

      await atualizarContext({ nome, email, foto: imageUri });
      mostrarNotificacao("sucesso", "Conta atualizada com sucesso!");
      setSenha("");
    } catch (error) {
      console.log(error);
      mostrarNotificacao("erro", "Não foi possível atualizar a conta");
    }
  };

  const handleDeletar = async () => {
    if (!confirmandoDeletar) {
      setConfirmandoDeletar(true);
      setTimeout(() => setConfirmandoDeletar(false), 3000);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/${usuario.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao deletar");

      mostrarNotificacao("sucesso", "Conta deletada!");
      setTimeout(async () => {
        await logout();
        router.replace("/login");
      }, 1000);
    } catch (error) {
      mostrarNotificacao("erro", "Não foi possível deletar a conta");
    }
  };

  const handleLogout = async () => {
    if (!confirmandoLogout) {
      setConfirmandoLogout(true);
      setTimeout(() => setConfirmandoLogout(false), 3000);
      return;
    }
    mostrarNotificacao("sucesso", "Até logo!");
    setTimeout(async () => {
      await logout();
      router.replace("/login");
    }, 1000);
  };
  if (!estaLogado) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Conta</Text>
        <View style={styles.cardDeslogado}>
          <Feather name="user" size={48} color="#430883" />
          <Text style={styles.deslogadoTexto}>
            Faça login para ver suas informações
          </Text>
          <TouchableOpacity
            style={styles.entrarButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.patchText}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.registerLink}>
              Ainda não tem conta? Crie uma
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notificacao && (
        <View
          style={[
            styles.notificacao,
            notificacao.tipo === "sucesso"
              ? styles.notificacaoSucesso
              : styles.notificacaoErro,
          ]}
        >
          <Text style={styles.notificacaoTexto}>{notificacao.msg}</Text>
        </View>
      )}

      <Text style={styles.title}>Conta</Text>
      <View style={styles.card}>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={handleImagePicker}>
            <Image
              source={{
                uri:
                  imageUri ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(nome),
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImagePicker}>
            <Text style={styles.changeImageText}>Alterar imagem</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nome</Text>
        <TextInput value={nome} onChangeText={setNome} style={styles.input} />

        <Text style={styles.label}>Email cadastrado</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          secureTextEntry
          placeholder="Digite para alterar a senha"
          placeholderTextColor="#888"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              confirmandoLogout && styles.logoutConfirmando,
            ]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>
              {confirmandoLogout ? "Clique de novo para sair" : "Sair"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.patchButton} onPress={salvarUsuario}>
            <Text style={styles.patchText}>Alterar dados</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.deletarButton,
            confirmandoDeletar && styles.deletarConfirmando,
          ]}
          onPress={handleDeletar}
        >
          <Text style={styles.logoutText}>
            {confirmandoDeletar
              ? "Confirmar exclusão da conta"
              : "Deletar conta"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#0f0f1a",
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
    fontSize: 26,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "600",
  },
  card: {
    width: "100%",
    minHeight: 400,
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changeImageText: {
    color: "#430883",
    fontWeight: "500",
  },
  label: {
    color: "#555",
    fontSize: 14,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  logoutButton: {
    backgroundColor: "#c0392b",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  patchButton: {
    backgroundColor: "#430883",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "500",
  },
  patchText: {
    color: "#fff",
    fontWeight: "500",
  },
  cardDeslogado: {
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    gap: 16,
    width: "100%",
  },
  deslogadoTexto: {
    color: "#555",
    fontSize: 15,
    textAlign: "center",
  },
  entrarButton: {
    backgroundColor: "#430883",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  registerLink: {
    color: "#430883",
    fontWeight: "500",
    fontSize: 13,
  },
  logoutConfirmando: {
  backgroundColor: "#e67e22",
  paddingHorizontal: 10,
},
deletarButton: {
  backgroundColor: "#430883",
  paddingVertical: 10,
  paddingHorizontal: 25,
  borderRadius: 25,
  alignItems: "center",
  marginTop: 12,
},
deletarConfirmando: {
  backgroundColor: "#430883",
},
});
