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
import { useAds } from "../components/context/AdsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Header from "../components/header";

const AD_STORAGE_KEY = "ad_form_data";

const INITIAL_FORM = {
  category: "",
  subcategory: "",
  nome: "",
  descricao: "",
  preco: "",
  negotiable: false,
  condition: "",
  cep: "",
  city: "",
  contacts: [],
  photos: [],
};

const CONTACT_LABEL = {
  chat: "Chat",
  whatsapp: "WhatsApp",
  phone: "Telefone",
};

export default function RevisarAnuncios(props) {
  const router = useRouter();
  const { publishAd, updateAd } = useAds();
  const [form, setForm] = useState(INITIAL_FORM);
  const [terms, setTerms] = useState(false);
  const [lbVisible, setLbVisible] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  useEffect(() => {
    if (props.form) {
      setForm({ ...INITIAL_FORM, ...props.form });
    }
  }, [props.form]);

  useEffect(() => {
    if (typeof props.terms === "boolean") {
      setTerms(props.terms);
    }
  }, [props.terms]);

  useEffect(() => {
    if (props.form) return;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(AD_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setForm((prev) => ({ ...prev, ...parsed }));
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const formattedPrice =
    form.preco && !isNaN(Number(form.preco))
      ? "R$ " + Number(form.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
      : "A combinar";

  const rawDesc = form.descricao ?? "";
  const shortDesc =
    rawDesc.length > 0
      ? rawDesc.slice(0, 120) + (rawDesc.length > 120 ? "..." : "")
      : "(sem descrição)";

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

  try {
    const response = await fetch("http://192.168.0.8:5000/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: form.nome,
        descricao: form.descricao,
        preco: Number(form.preco),
        estoque: 1,
        categoriaId: Number(form.category) || 1,
        imagem_url: form.photos?.[0] ?? "",
      }),
    });

    const data = await response.json();
    console.log("STATUS:", response.status);
    console.log("RESPOSTA:", data);

    if (!response.ok) return;

    publishAd({
      title: form.nome,
      description: form.descricao,
      price: form.preco,
      negotiable: form.negotiable,
      condition: form.condition,
      city: form.city,
      cep: form.cep,
      contacts: form.contacts,
      photos: form.photos,
      produtoId: data.id,
    });

    await AsyncStorage.removeItem(AD_STORAGE_KEY);
    router.push("/");
  } catch (err) {
    console.log("ERRO:", err);
  }
}

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
          <View style={styles.main}>
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>Revise seu anúncio</Text>
              <Text style={styles.heroSub}>
                Veja como ficará para os compradores antes de publicar.
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.photoBox}>
                {photos.length > 0 ? (
                  <>
                    <TouchableOpacity onPress={() => openLightbox(0)} activeOpacity={0.9}>
                      <Image source={{ uri: photos[0] }} style={styles.photoMain} resizeMode="cover" />
                      {photos.length > 1 && (
                        <View style={styles.photoBadge}>
                          <Text style={styles.photoBadgeText}>📷 {photos.length}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    {photos.length > 1 && (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.photoStrip}
                        contentContainerStyle={styles.photoStripContent}
                      >
                        {photos.slice(1).map((uri, i) => (
                          <TouchableOpacity key={`strip-${i}`} onPress={() => openLightbox(i + 1)} activeOpacity={0.85}>
                            <Image source={{ uri }} style={styles.photoThumb} resizeMode="cover" />
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

              <View style={styles.cardBody}>
                <Text style={styles.adTitle}>{form.nome || "(sem título)"}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.adPrice}>{formattedPrice}</Text>
                  {form.negotiable && (
                    <Text style={styles.negotiableBadge}>negociável</Text>
                  )}
                </View>
                <Text style={styles.adDesc}>{shortDesc}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.termsRow} onPress={handleToggleTerms}>
              <View style={[styles.checkbox, terms && styles.checkboxChecked]}>
                {terms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                Li e aceito os{" "}
                <Text style={styles.termsLink} onPress={() => Linking.openURL("https://seusite.com/termos")}>
                  Termos de Uso
                </Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.navRow}>
              <TouchableOpacity style={styles.btnBack} onPress={handleBack}>
                <Text style={styles.btnBackText}>← Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnPublish, !terms && styles.btnPublishDisabled]}
                onPress={handlePublish}
                disabled={!terms}
              >
                <Text style={styles.btnPublishText}>
                  {form.id ? "Salvar alterações" : "Publicar anúncio"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal visible={lbVisible} transparent animationType="fade" onRequestClose={() => setLbVisible(false)}>
        <Pressable style={styles.lbOverlay} onPress={() => setLbVisible(false)}>
          <Pressable style={styles.lbContainer}>
            {photos[lbIndex] && (
              <Image source={{ uri: photos[lbIndex] }} style={styles.lbImage} resizeMode="contain" />
            )}
            <TouchableOpacity style={styles.lbClose} onPress={() => setLbVisible(false)}>
              <Text style={styles.lbCloseText}>×</Text>
            </TouchableOpacity>
            {photos.length > 1 && (
              <>
                <TouchableOpacity style={[styles.lbArrow, styles.lbArrowLeft]} onPress={lbPrev}>
                  <Text style={styles.lbArrowText}>‹</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.lbArrow, styles.lbArrowRight]} onPress={lbNext}>
                  <Text style={styles.lbArrowText}>›</Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1 },
  main: { padding: 16 },
  hero: { borderLeftWidth: 4, borderLeftColor: "#A636E9", paddingLeft: 12, marginBottom: 20 },
  heroTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },
  heroSub: { color: "#ccc", fontSize: 13, marginTop: 2 },
  card: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 2, borderColor: "#A636E9", overflow: "hidden", marginBottom: 20 },
  photoBox: { backgroundColor: "#f3f4f6" },
  photoMain: { width: "100%", height: 220 },
  photoBadge: { position: "absolute", bottom: 8, right: 10, backgroundColor: "rgba(0,0,0,0.55)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  photoBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  photoEmpty: { height: 180, alignItems: "center", justifyContent: "center", backgroundColor: "#f3f4f6" },
  photoEmptyIcon: { fontSize: 40, marginBottom: 6 },
  photoEmptyText: { color: "#aaa", fontSize: 13, fontWeight: "600" },
  photoStrip: { maxHeight: 68, backgroundColor: "#eee" },
  photoStripContent: { padding: 6 },
  photoThumb: { width: 56, height: 56, borderRadius: 6, marginRight: 4 },
  cardBody: { padding: 16 },
  adTitle: { fontSize: 17, fontWeight: "900", color: "#1a1a1a", marginBottom: 6 },
  priceRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  adPrice: { fontSize: 22, fontWeight: "900", color: "#A636E9", marginRight: 8 },
  negotiableBadge: { fontSize: 12, fontWeight: "700", color: "#999", backgroundColor: "#f3f4f6", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  adDesc: { fontSize: 13, color: "#666", fontWeight: "600", marginBottom: 10, lineHeight: 19 },
  termsRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 24 },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 2, borderColor: "rgba(166,54,233,0.5)", backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0, marginRight: 10 },
  checkboxChecked: { backgroundColor: "#A636E9", borderColor: "#A636E9" },
  checkmark: { color: "#fff", fontSize: 12, fontWeight: "900", lineHeight: 14 },
  termsText: { flex: 1, fontSize: 12, color: "#aaa", fontWeight: "600", lineHeight: 18 },
  termsLink: { color: "#c084fc", textDecorationLine: "underline" },
  navRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  btnBack: { borderWidth: 2, borderColor: "rgba(166,54,233,0.4)", borderRadius: 50, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: "#fff" },
  btnBackText: { color: "#A636E9", fontWeight: "700", fontSize: 13 },
  btnPublish: { backgroundColor: "#A636E9", borderRadius: 50, paddingHorizontal: 24, paddingVertical: 12, borderWidth: 2, borderColor: "#fff", shadowColor: "#A636E9", shadowOpacity: 0.35, shadowRadius: 8, elevation: 6 },
  btnPublishDisabled: { opacity: 0.4, shadowOpacity: 0, elevation: 0 },
  btnPublishText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  lbOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.92)", justifyContent: "center", alignItems: "center" },
  lbContainer: { width: "100%", alignItems: "center", paddingHorizontal: 16 },
  lbImage: { width: "100%", height: 320, borderRadius: 12 },
  lbClose: { position: "absolute", top: -14, right: 16, backgroundColor: "#A636E9", borderRadius: 20, width: 32, height: 32, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fff" },
  lbCloseText: { color: "#fff", fontSize: 20, fontWeight: "900", lineHeight: 24 },
  lbArrow: { position: "absolute", top: 130, backgroundColor: "rgba(166,54,233,0.7)", borderRadius: 30, width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  lbArrowLeft: { left: 20 },
  lbArrowRight: { right: 20 },
  lbArrowText: { color: "#fff", fontSize: 26, fontWeight: "900", lineHeight: 30 },
});