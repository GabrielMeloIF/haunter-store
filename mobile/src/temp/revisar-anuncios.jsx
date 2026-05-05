import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Linking,
  Modal,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Header from "../components/header";
import NavBar from "../components/navbar";

// ── Constantes — mesmos valores de anunciar.jsx ───────────────────────────────

const AD_STORAGE_KEY = "ad_form_data";

const INITIAL_FORM = {
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

const CONTACT_LABEL = {
  chat:     "Chat",
  whatsapp: "WhatsApp",
  phone:    "Telefone",
};

// ── Componente principal ──────────────────────────────────────────────────────

export default function RevisarAnuncios(props) {
  const router = useRouter();
  const [form, setForm]     = useState(INITIAL_FORM);
  const [terms, setTerms]   = useState(false);

  // Lightbox
  const [lbVisible, setLbVisible] = useState(false);
  const [lbIndex, setLbIndex]     = useState(0);

  // ── Sincroniza props.form quando fornecido externamente ───────────────────
  useEffect(() => {
    if (props.form) {
      setForm({ ...INITIAL_FORM, ...props.form });
    }
  }, [props.form]);

  // ── Sincroniza props.terms quando fornecido externamente ──────────────────
  useEffect(() => {
    if (typeof props.terms === "boolean") {
      setTerms(props.terms);
    }
  }, [props.terms]);

  // ── Carrega rascunho salvo (somente quando sem props.form) ─────────────────
  useEffect(() => {
    if (props.form) return;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(AD_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setForm((prev) => ({ ...prev, ...parsed }));
        }
      } catch (_) {}
    })();
  }, []);

  // ── Formatações ───────────────────────────────────────────────────────────

  const formattedPrice =
    form.price && !isNaN(Number(form.price))
      ? "R$ " +
        Number(form.price).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })
      : "A combinar";

  const rawDesc = form.description ?? "";
  const shortDesc = rawDesc.length > 0
    ? rawDesc.slice(0, 120) + (rawDesc.length > 120 ? "…" : "")
    : "(sem descrição)";

  // ── Lightbox ──────────────────────────────────────────────────────────────

  function openLightbox(index) {
    if (!form.photos?.length) return;
    setLbIndex(Math.min(index, form.photos.length - 1));
    setLbVisible(true);
  }

  function lbPrev() {
    setLbIndex((i) => (i - 1 + form.photos.length) % form.photos.length);
  }

  function lbNext() {
    setLbIndex((i) => (i + 1) % form.photos.length);
  }

  // ── Ações ─────────────────────────────────────────────────────────────────

  function handleToggleTerms() {
    if (props.onTerms) {
      props.onTerms(!terms);
    } else {
      setTerms((v) => !v);
    }
  }

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
      try {
        await AsyncStorage.removeItem(AD_STORAGE_KEY);
      } catch (_) {}
      router.push("/");
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const photos = form.photos ?? [];

  return (
    <>
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

              {/* ── Galeria de fotos ── */}
              <View style={styles.photoBox}>
                {photos.length > 0 ? (
                  <>
                    {/* Foto principal clicável */}
                    <TouchableOpacity
                      onPress={() => openLightbox(0)}
                      activeOpacity={0.9}
                    >
                      <Image
                        source={{ uri: photos[0] }}
                        style={styles.photoMain}
                        resizeMode="cover"
                      />
                      {photos.length > 1 && (
                        <View style={styles.photoBadge}>
                          <Text style={styles.photoBadgeText}>
                            📷 {photos.length}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    {/* Miniaturas extras clicáveis */}
                    {photos.length > 1 && (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.photoStrip}
                        contentContainerStyle={styles.photoStripContent}
                      >
                        {photos.slice(1).map((uri, i) => (
                          <TouchableOpacity
                            key={`strip-${i}`}
                            onPress={() => openLightbox(i + 1)}
                            activeOpacity={0.85}
                          >
                            <Image
                              source={{ uri }}
                              style={styles.photoThumb}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                  </>
                ) : (
                  <View style={styles.photoEmpty}>
                    <Text style={styles.photoEmptyIcon}>🖼️</Text>
                    <Text style={styles.photoEmptyText}>Sem imagem</Text>
                  </View>
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
                  {form.city || form.cep ? (
                    <Text style={styles.metaText}>
                      📍 {[form.city, form.cep].filter(Boolean).join(" · ")}
                    </Text>
                  ) : (
                    <Text style={styles.metaText}>📍 Localização não informada</Text>
                  )}
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaText}>Agora</Text>
                </View>

                <View style={styles.chipsRow}>
                  {form.condition ? (
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>{form.condition}</Text>
                    </View>
                  ) : null}
                  {(form.contacts ?? []).map((c) => (
                    <View key={c} style={styles.chip}>
                      <Text style={styles.chipText}>
                        {CONTACT_LABEL[c] ?? c}
                      </Text>
                    </View>
                  ))}
                </View>

              </View>
            </View>

            {/* ── Termos ── */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={handleToggleTerms}
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

      {/* ── Lightbox ── */}
      <Modal
        visible={lbVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLbVisible(false)}
        statusBarTranslucent
      >
        <Pressable
          style={styles.lbOverlay}
          onPress={() => setLbVisible(false)}
        >
          <Pressable style={styles.lbContainer}>
            {photos[lbIndex] ? (
              <Image
                source={{ uri: photos[lbIndex] }}
                style={styles.lbImage}
                resizeMode="contain"
              />
            ) : null}

            <Text style={styles.lbCounter}>
              {lbIndex + 1} / {photos.length}
            </Text>

            <TouchableOpacity
              style={styles.lbClose}
              onPress={() => setLbVisible(false)}
            >
              <Text style={styles.lbCloseText}>×</Text>
            </TouchableOpacity>

            {photos.length > 1 && (
              <>
                <TouchableOpacity
                  style={[styles.lbArrow, styles.lbArrowLeft]}
                  onPress={lbPrev}
                >
                  <Text style={styles.lbArrowText}>‹</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.lbArrow, styles.lbArrowRight]}
                  onPress={lbNext}
                >
                  <Text style={styles.lbArrowText}>›</Text>
                </TouchableOpacity>
              </>
            )}

            {photos.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.lbStrip}
                contentContainerStyle={styles.lbStripContent}
              >
                {photos.map((uri, i) => (
                  <TouchableOpacity
                    key={`lb-${i}`}
                    onPress={() => setLbIndex(i)}
                    style={[
                      styles.lbThumb,
                      i === lbIndex && styles.lbThumbActive,
                    ]}
                  >
                    <Image
                      source={{ uri }}
                      style={styles.lbThumbImg}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#A636E9",
    overflow: "hidden",
    marginBottom: 20,
  },
  photoBox: {
    backgroundColor: "#f3f4f6",
  },
  photoMain: {
    width: "100%",
    height: 220,
  },
  photoBadge: {
    position: "absolute",
    bottom: 8,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  photoBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
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
    maxHeight: 68,
    backgroundColor: "#eee",
  },
  photoStripContent: {
    padding: 6,
  },
  photoThumb: {
    width: 56,
    height: 56,
    borderRadius: 6,
    marginRight: 4,
  },
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
    marginBottom: 8,
  },
  adPrice: {
    fontSize: 22,
    fontWeight: "900",
    color: "#A636E9",
    marginRight: 8,
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
    marginBottom: 12,
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 12,
    color: "#aaa",
    fontWeight: "700",
  },
  metaDot: {
    color: "#ccc",
    fontSize: 12,
    marginHorizontal: 4,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: "#f5eaff",
    borderWidth: 1,
    borderColor: "rgba(166,54,233,0.3)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    color: "#A636E9",
    fontSize: 11,
    fontWeight: "800",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    marginRight: 10,
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
  lbOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  lbContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  lbImage: {
    width: "100%",
    height: 320,
    borderRadius: 12,
  },
  lbCounter: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 10,
    fontWeight: "600",
  },
  lbClose: {
    position: "absolute",
    top: -14,
    right: 16,
    backgroundColor: "#A636E9",
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  lbCloseText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 24,
  },
  lbArrow: {
    position: "absolute",
    top: 130,
    backgroundColor: "rgba(166,54,233,0.7)",
    borderRadius: 30,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  lbArrowLeft: {
    left: 20,
  },
  lbArrowRight: {
    right: 20,
  },
  lbArrowText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 30,
  },
  lbStrip: {
    marginTop: 14,
    maxHeight: 60,
  },
  lbStripContent: {
    paddingHorizontal: 4,
  },
  lbThumb: {
    width: 52,
    height: 52,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    marginRight: 8,
  },
  lbThumbActive: {
    borderColor: "#A636E9",
  },
  lbThumbImg: {
    width: "100%",
    height: "100%",
  },
});