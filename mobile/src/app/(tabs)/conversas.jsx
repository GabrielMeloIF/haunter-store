import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import Header from "../../components/header";
import { AntDesign } from "@expo/vector-icons";

const chatInicial = [
  {
    id: 1,
    usuario: "Kauan",
    avatar: "https://pbs.twimg.com/media/DqPSpVzWsAAAWqP.jpg",
    mensagem: "Ola sou o kauan...",
    mensagens: [
      { id: 1, texto: "Oi, tenho interesse!", eu: false },
      { id: 2, texto: "Ola, kauan", eu: true },
    ],
  },
];

export default function Chat() {
  const [chats, setChats] = useState(chatInicial);
  const [chatSelecionado, setChatSelecionado] = useState(null);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [menuAberto, setMenuAberto] = useState(null);

  const enviarMensagem = () => {
    if (!novaMensagem.trim()) return;

    const novaMsg = {
      id: Date.now(),
      texto: novaMensagem,
      eu: true,
    };

    const novosChats = chats.map((c) =>
      c.id === chatSelecionado.id
        ? {
            ...c,
            mensagens: [...c.mensagens, novaMsg],
            mensagem: novaMensagem,
          }
        : c
    );

    setChats(novosChats);
    setChatSelecionado({
      ...chatSelecionado,
      mensagens: [...chatSelecionado.mensagens, novaMsg],
    });

    setNovaMensagem("");
  };

  const excluirMensagem = (msgId) => {
    const novosChats = chats.map((c) =>
      c.id === chatSelecionado.id
        ? {
            ...c,
            mensagens: c.mensagens.filter((m) => m.id !== msgId),
          }
        : c
    );

    setChats(novosChats);
    setChatSelecionado({
      ...chatSelecionado,
      mensagens: chatSelecionado.mensagens.filter((m) => m.id !== msgId),
    });

    setMenuAberto(null);
  };

  const editarMensagem = (msgId, textoAtual) => {
    Alert.prompt("Editar mensagem", "", (novoTexto) => {
      if (!novoTexto) return;

      const novosChats = chats.map((c) =>
        c.id === chatSelecionado.id
          ? {
              ...c,
              mensagens: c.mensagens.map((m) =>
                m.id === msgId ? { ...m, texto: novoTexto } : m
              ),
            }
          : c
      );

      setChats(novosChats);
      setChatSelecionado({
        ...chatSelecionado,
        mensagens: chatSelecionado.mensagens.map((m) =>
          m.id === msgId ? { ...m, texto: novoTexto } : m
        ),
      });

      setMenuAberto(null);
    });
  };

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        {/* LISTA DE CHATS */}
        <View style={styles.sidebar}>
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.chatItem}
                onPress={() => setChatSelecionado(item)}
              >
                <Image source={{ uri: item.avatar }} style={styles.avatar} />

                <View>
                  <Text style={styles.nome}>{item.usuario}</Text>
                  <Text style={styles.preview}>{item.mensagem}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* CHAT */}
        <View style={styles.chatArea}>
          {chatSelecionado ? (
            <>
              {/* HEADER */}
              <View style={styles.chatHeader}>
                <Image
                  source={{ uri: chatSelecionado.avatar }}
                  style={styles.avatar}
                />
                <Text style={styles.nome}>
                  {chatSelecionado.usuario}
                </Text>
              </View>

              {/* MENSAGENS */}
              <FlatList
                data={chatSelecionado.mensagens}
                keyExtractor={(item) => item.id.toString()}
                style={{ flex: 1 }}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.msg,
                      item.eu ? styles.msgEu : styles.msgOutro,
                    ]}
                  >
                    <Text style={{ color: "#fff" }}>{item.texto}</Text>

                    {item.eu && (
                      <TouchableOpacity
                        onPress={() =>
                          setMenuAberto(
                            menuAberto === item.id ? null : item.id
                          )
                        }
                      >
                        <AntDesign name="down" size={16} color="#fff" />
                      </TouchableOpacity>
                    )}

                    {menuAberto === item.id && (
                      <View style={styles.menu}>
                        <TouchableOpacity
                          onPress={() =>
                            editarMensagem(item.id, item.texto)
                          }
                        >
                          <Text style={styles.menuText}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => excluirMensagem(item.id)}
                        >
                          <Text style={[styles.menuText, { color: "red" }]}>
                            Excluir
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              />

              {/* INPUT */}
              <View style={styles.inputArea}>
                <TextInput
                  value={novaMensagem}
                  onChangeText={setNovaMensagem}
                  placeholder="Digite..."
                  placeholderTextColor="#aaa"
                  style={styles.input}
                />

                <TouchableOpacity
                  style={styles.btn}
                  onPress={enviarMensagem}
                >
                  <Text style={{ color: "#fff" }}>Enviar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={{ color: "#aaa", padding: 20 }}>
              Selecione um chat
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030",
  },

  content: {
    flex: 1,
    flexDirection: "row",
  },

  sidebar: {
    width: "35%",
    backgroundColor: "#444",
    padding: 10,
  },

  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  nome: {
    color: "#fff",
    fontWeight: "bold",
  },

  preview: {
    color: "#aaa",
    fontSize: 12,
  },

  chatArea: {
    flex: 1,
    backgroundColor: "#222",
  },

  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#444",
  },

  msg: {
    padding: 10,
    borderRadius: 10,
    margin: 5,
    maxWidth: "70%",
  },

  msgEu: {
    backgroundColor: "#A636E9",
    alignSelf: "flex-end",
  },

  msgOutro: {
    backgroundColor: "#555",
    alignSelf: "flex-start",
  },

  menu: {
    backgroundColor: "#333",
    padding: 5,
    borderRadius: 6,
    marginTop: 5,
  },

  menuText: {
    color: "#fff",
    padding: 5,
  },

  inputArea: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#111",
  },

  input: {
    flex: 1,
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },

  btn: {
    backgroundColor: "#A636E9",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
  },
});