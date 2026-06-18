import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useFocusEffect } from "expo-router";
import Header from "../../components/header/index";
import { useAuth } from "../../components/context/authContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Admin() {
  const { usuario } = useAuth();

  const [aba, setAba] = useState("produtos");
  const [produtos, setProdutos] = useState([]);
  const [cupons, setCupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalCupom, setModalCupom] = useState(false);
  const [novoCupom, setNovoCupom] = useState({
    codigo: "",
    descricao: "",
    desconto: "",
    validade: "",
  });

  async function buscarProdutos() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/produtos`);
      const data = await response.json();
      setProdutos(data);
    } catch (err) {
      console.log("Erro ao buscar produtos:", err);
    } finally {
      setLoading(false);
    }
  }

  async function buscarCupons() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cupons`);
      const data = await response.json();
      setCupons(data);
    } catch (err) {
      console.log("Erro ao buscar cupons:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ useFocusEffect ANTES do guard
  useFocusEffect(
    useCallback(() => {
      if (usuario?.tipo === "ADMIN") {
        buscarProdutos();
        buscarCupons();
      }
    }, [usuario]),
  );

  async function deletarProduto(id) {
    const confirmado = window.confirm(
      "Tem certeza que deseja remover este produto?",
    );
    if (!confirmado) return;

    try {
      const response = await fetch(`${API_URL}/produtos/${id}`, {
        method: "DELETE",
      });
      console.log("STATUS DELETE PRODUTO:", response.status);
      if (response.ok) {
        setProdutos((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.log("Erro ao deletar produto:", err);
    }
  }

  async function deletarCupom(id) {
    const confirmado = window.confirm(
      "Tem certeza que deseja remover este cupom?",
    );
    if (!confirmado) return;

    try {
      const response = await fetch(`${API_URL}/cupons/${id}`, {
        method: "DELETE",
      });
      console.log("STATUS DELETE CUPOM:", response.status);
      if (response.ok) {
        setCupons((prev) => prev.filter((c) => c.id_cupom !== id));
      }
    } catch (err) {
      console.log("Erro ao deletar cupom:", err);
    }
  }

  async function criarCupom() {
    if (!novoCupom.codigo || !novoCupom.desconto || !novoCupom.validade) {
      Alert.alert("Atenção", "Preencha código, desconto e validade.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cupons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: novoCupom.codigo.toUpperCase(),
          descricao: novoCupom.descricao,
          desconto: Number(novoCupom.desconto),
          validade: new Date(novoCupom.validade + "T00:00:00").toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCupons((prev) => [data, ...prev]);
        setNovoCupom({ codigo: "", descricao: "", desconto: "", validade: "" });
        setModalCupom(false);
      }
    } catch (err) {
      console.log("Erro ao criar cupom:", err);
    }
  }

  // ✅ Guard DEPOIS de todos os hooks
  if (!usuario || usuario.tipo !== "ADMIN") {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.semPermissao}>
          <Text style={styles.semPermissaoIcone}>🔒</Text>
          <Text style={styles.semPermissaoTitulo}>Acesso restrito</Text>
          <Text style={styles.semPermissaoSub}>
            Apenas administradores podem acessar esta área.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroIcone}>⚙️</Text>
          <View>
            <Text style={styles.heroTitulo}>Painel Admin</Text>
            <Text style={styles.heroSub}>Olá, {usuario.nome}</Text>
          </View>
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.cardResumo}>
            <Text style={styles.cardResumoNumero}>{produtos.length}</Text>
            <Text style={styles.cardResumoLabel}>Produtos</Text>
          </View>
          <View style={styles.cardResumo}>
            <Text style={styles.cardResumoNumero}>{cupons.length}</Text>
            <Text style={styles.cardResumoLabel}>Cupons</Text>
          </View>
        </View>

        <View style={styles.abas}>
          <TouchableOpacity
            style={[styles.aba, aba === "produtos" && styles.abaAtiva]}
            onPress={() => setAba("produtos")}
          >
            <Text
              style={[
                styles.abaTexto,
                aba === "produtos" && styles.abaTextoAtivo,
              ]}
            >
              Produtos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.aba, aba === "cupons" && styles.abaAtiva]}
            onPress={() => setAba("cupons")}
          >
            <Text
              style={[
                styles.abaTexto,
                aba === "cupons" && styles.abaTextoAtivo,
              ]}
            >
              Cupons
            </Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator color="#A636E9" style={{ marginTop: 20 }} />
        )}

        {aba === "produtos" && !loading && (
          <View style={styles.lista}>
            {produtos.length === 0 ? (
              <Text style={styles.vazio}>Nenhum produto cadastrado</Text>
            ) : (
              produtos.map((item) => (
                <View key={String(item.id)} style={styles.itemCard}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemNome} numberOfLines={1}>
                      {item.nome}
                    </Text>
                    <Text style={styles.itemPreco}>
                      R${" "}
                      {Number(item.preco).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </Text>
                    <Text style={styles.itemEstoque}>
                      Estoque: {item.estoque}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.btnDeletar}
                    onPress={() => deletarProduto(item.id)}
                  >
                    <Text style={styles.btnDeletarTexto}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {aba === "cupons" && !loading && (
          <View style={styles.lista}>
            <TouchableOpacity
              style={styles.btnNovoCupom}
              onPress={() => setModalCupom(true)}
            >
              <Text style={styles.btnNovoCupomTexto}>+ Novo cupom</Text>
            </TouchableOpacity>

            {cupons.length === 0 ? (
              <Text style={styles.vazio}>Nenhum cupom cadastrado</Text>
            ) : (
              cupons.map((item) => (
                <View key={String(item.id_cupom)} style={styles.itemCard}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.cupomCodigo}>{item.codigo}</Text>
                    {item.descricao ? (
                      <Text style={styles.itemEstoque}>{item.descricao}</Text>
                    ) : null}
                    <Text style={styles.itemPreco}>
                      {item.desconto}% de desconto
                    </Text>
                    <Text style={styles.itemEstoque}>
                      Válido até:{" "}
                      {new Date(item.validade).toLocaleDateString("pt-BR")}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.btnDeletar}
                    onPress={() => deletarCupom(item.id_cupom)}
                  >
                    <Text style={styles.btnDeletarTexto}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={modalCupom} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Novo cupom</Text>

            <TextInput
              style={styles.input}
              placeholder="Código (ex: SAVE10)"
              placeholderTextColor="#999"
              value={novoCupom.codigo}
              onChangeText={(v) => setNovoCupom((p) => ({ ...p, codigo: v }))}
              autoCapitalize="characters"
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição (opcional)"
              placeholderTextColor="#999"
              value={novoCupom.descricao}
              onChangeText={(v) =>
                setNovoCupom((p) => ({ ...p, descricao: v }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Desconto em % (ex: 10)"
              placeholderTextColor="#999"
              value={novoCupom.desconto}
              onChangeText={(v) => setNovoCupom((p) => ({ ...p, desconto: v }))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Validade (ex: 2025-12-31)"
              placeholderTextColor="#999"
              value={novoCupom.validade}
              onChangeText={(v) => setNovoCupom((p) => ({ ...p, validade: v }))}
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => setModalCupom(false)}
              >
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnCriar} onPress={criarCupom}>
                <Text style={styles.btnCriarTexto}>Criar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  semPermissao: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  semPermissaoIcone: { fontSize: 48, marginBottom: 12 },
  semPermissaoTitulo: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 6,
  },
  semPermissaoSub: { color: "#aaa", fontSize: 13, textAlign: "center" },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(166,54,233,0.2)",
  },
  heroIcone: { fontSize: 32 },
  heroTitulo: { color: "#fff", fontSize: 18, fontWeight: "900" },
  heroSub: { color: "#aaa", fontSize: 13, marginTop: 2 },
  cardsRow: { flexDirection: "row", padding: 16, gap: 12 },
  cardResumo: {
    flex: 1,
    backgroundColor: "#1e1e2e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(166,54,233,0.3)",
    padding: 16,
    alignItems: "center",
  },
  cardResumoNumero: { color: "#A636E9", fontSize: 32, fontWeight: "900" },
  cardResumoLabel: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  abas: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: "#1e1e2e",
    borderRadius: 10,
    padding: 4,
  },
  aba: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 8 },
  abaAtiva: { backgroundColor: "#A636E9" },
  abaTexto: { color: "#aaa", fontWeight: "700", fontSize: 13 },
  abaTextoAtivo: { color: "#fff" },
  lista: { padding: 16 },
  vazio: { color: "#aaa", textAlign: "center", marginTop: 20 },
  itemCard: {
    backgroundColor: "#1e1e2e",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(166,54,233,0.2)",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemInfo: { flex: 1 },
  itemNome: { color: "#fff", fontSize: 15, fontWeight: "800", marginBottom: 3 },
  itemPreco: {
    color: "#00ff99",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  itemEstoque: { color: "#888", fontSize: 12 },
  cupomCodigo: {
    color: "#A636E9",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 3,
  },
  btnDeletar: {
    backgroundColor: "rgba(255,68,68,0.15)",
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
  btnDeletarTexto: { fontSize: 18 },
  btnNovoCupom: {
    backgroundColor: "#A636E9",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginBottom: 6,
  },
  btnNovoCupomTexto: { color: "#fff", fontWeight: "900", fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#1e1e2e",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 12,
    borderTopWidth: 2,
    borderColor: "#A636E9",
  },
  modalTitulo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#0f0f1a",
    borderWidth: 1,
    borderColor: "rgba(166,54,233,0.4)",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    fontSize: 14,
  },
  modalBotoes: { flexDirection: "row", gap: 10, marginTop: 4 },
  btnCancelar: {
    flex: 1,
    borderWidth: 2,
    borderColor: "rgba(166,54,233,0.4)",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  btnCancelarTexto: { color: "#aaa", fontWeight: "700" },
  btnCriar: {
    flex: 1,
    backgroundColor: "#A636E9",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  btnCriarTexto: { color: "#fff", fontWeight: "900" },
});
