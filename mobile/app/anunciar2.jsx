import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Header from "../src/components/header";
import NavBar from "../src/components/navbar";

const AD_STORAGE_KEY = "ad_form_data";

const EMPTY_FORM = {
  category:    "",
  subcategory: "",
  title:       "",
  description: "",
  price:       "",
  negotiable:  false,
  condition:   "",
  cep:         "",
  city:        "",
  contacts:    [],
  photos:      [],
};

// ── Componente principal ──────────────────────────────────────────────────────

export default function StepReview(props) {
  const router = useRouter();
  const [form, setForm]   = useState(props.form ?? EMPTY_FORM);
  const [terms, setTerms] = useState(props.terms ?? false);

  // Carrega rascunho salvo
  useEffect(() => {
    if (props.form) return;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(AD_STORAGE_KEY);
        if (saved) setForm({ ...EMPTY_FORM, ...JSON.parse(saved) });
      } catch {}
    })();
  }, [props.form]);

  // ── Formatações ───────────────────────────────────────────────────────────

  const formattedPrice =
    form.price && !isNaN(Number(form.price))
      ? "R$ " +
        Number(form.price).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })
      : "A combinar";

  const shortDesc = form.description
    ? form.description.slice(0, 120) +
      (form.description.length > 120 ? "…" : "")
    : "(sem descrição)";

  // ── Ações ─────────────────────────────────────────────────────────────────

  function handleBack() {
    if (props.onBack) {
      props.onBack();
    } else {
      router.push("/anunciar");
    }
  }

  async function handlePublish() {
    if (!terms) return;
    if (props.onPublish) {
      props.onPublish();
    } else {
      await AsyncStorage.removeItem(AD_STORAGE_KEY);
      router.push("/anuncio-finalizado");
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <Header />
        <NavBar />

        <View style={styles.main}>

          {/* Cabeçalho */}
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Revise seu anúncio</Text>
            <Text style={styles.heroSub}>
              Veja como ficará para os compradores antes de publicar.
            </Text>
          </View>

          {/* ── Card de visualização ── */}
          <View style={styles.card}>

            {/* Foto principal */}
            <View style={styles.photoBox}>
              {form.photos?.length > 0 ? (
                <Image
                  source={{ uri: form.photos[0] }}
                  style={styles.photoMain}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.photoEmpty}>
                  <Text style={styles.photoEmptyIcon}>🖼️</Text>
                  <Text style={styles.photoEmptyText}>Sem imagem</Text>
                </View>
              )}

              {/* Miniaturas extras */}
              {form.photos?.length > 1 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.photoStrip}
                  contentContainerStyle={styles.photoStripContent}
                >
                  {form.photos.slice(1).map((uri, i) => (
                    <Image
                      key={uri + i}
                      source={{ uri }}
                      style={styles.photoThumb}
                      resizeMode="cover"
                    />
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Detalhes do anúncio */}
            <View style={styles.cardBody}>

              <Text style={styles.adTitle}>
                {form.title || "(sem título)"}
              </Text>

              <View style={styles.priceRow}>
                <Text style={styles.adPrice}>{formattedPrice}</Text>
                {form.negotiable && (
                  <Text style={styles.negotiableBadge}>negociável</Text>
                )}
              </View>

              <Text style={styles.adDesc}>{shortDesc}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  📍 {form.city || "Localização não informada"}
                </Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}>Agora</Text>
              </View>

              {/* Chips de condição e contatos */}
              <View style={styles.chipsRow}>
                {form.condition ? (
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>{form.condition}</Text>
                  </View>
                ) : null}
                {form.contacts?.map((c) => (
                  <View key={c} style={styles.chip}>
                    <Text style={styles.chipText}>
                      {c === "chat" ? "Chat" : c === "whatsapp" ? "WhatsApp" : "Telefone"}
                    </Text>
                  </View>
                ))}
              </View>

            </View>
          </View>

          {/* ── Termos ── */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => {
              if (props.onTerms) props.onTerms(!terms);
              else setTerms((v) => !v);
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, terms && styles.checkboxChecked]}>
              {terms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              Li e aceito os{" "}
              <Text
                style={styles.termsLink}
                onPress={() => Linking.openURL("https://seusite.com/termos")}
              >
                Termos de Uso
              </Text>
              {" "}e{" "}
              <Text
                style={styles.termsLink}
                onPress={() => Linking.openURL("https://seusite.com/privacidade")}
              >
                Política de Privacidade
              </Text>
              .
            </Text>
          </TouchableOpacity>

          {/* ── Ações ── */}
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.btnBack} onPress={handleBack}>
              <Text style={styles.btnBackText}>← Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnPublish, !terms && styles.btnPublishDisabled]}
              onPress={handlePublish}
              disabled={!terms}
            >
              <Text style={styles.btnPublishText}>Publicar anúncio</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  main: {
    padding: 16,
  },

  // Hero
  hero: {
    borderLeftWidth: 4,
    borderLeftColor: "#A636E9",
    paddingLeft: 12,
    marginBottom: 20,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  heroSub: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 2,
  },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#A636E9",
    overflow: "hidden",
    marginBottom: 20,
  },

  // Foto
  photoBox: {
    backgroundColor: "#f3f4f6",
  },
  photoMain: {
    width: "100%",
    height: 220,
  },
  photoEmpty: {
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  photoEmptyIcon: {
    fontSize: 40,
    marginBottom: 6,
  },
  photoEmptyText: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: "600",
  },
  photoStrip: {
    maxHeight: 64,
    backgroundColor: "#eee",
  },
  photoStripContent: {
    gap: 4,
    padding: 6,
  },
  photoThumb: {
    width: 56,
    height: 52,
    borderRadius: 6,
  },

  // Corpo do card
  cardBody: {
    padding: 16,
  },
  adTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  adPrice: {
    fontSize: 22,
    fontWeight: "900",
    color: "#A636E9",
  },
  negotiableBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  adDesc: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    marginBottom: 10,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: "#aaa",
    fontWeight: "700",
  },
  metaDot: {
    color: "#ccc",
    fontSize: 12,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    backgroundColor: "#f5eaff",
    borderWidth: 1,
    borderColor: "rgba(166,54,233,0.3)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    color: "#A636E9",
    fontSize: 11,
    fontWeight: "800",
  },

  // Termos
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "rgba(166,54,233,0.5)",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: "#A636E9",
    borderColor: "#A636E9",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 14,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: "#aaa",
    fontWeight: "600",
    lineHeight: 18,
  },
  termsLink: {
    color: "#c084fc",
    textDecorationLine: "underline",
  },

  // Botões
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  btnBack: {
    borderWidth: 2,
    borderColor: "rgba(166,54,233,0.4)",
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  btnBackText: {
    color: "#A636E9",
    fontWeight: "700",
    fontSize: 13,
  },
  btnPublish: {
    backgroundColor: "#A636E9",
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#A636E9",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  btnPublishDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnPublishText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});