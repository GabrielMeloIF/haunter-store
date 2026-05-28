import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Switch,
  Modal,
  Platform,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import Header from "../components/header";

// ── Constantes ───────────────────────────────────────────────────────────────

const CONTACT_OPTIONS = [
  { id: "chat",     label: "Chat"     },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "phone",    label: "Telefone" },
];

const CONDITION_OPTIONS = ["Novo", "Seminovo", "Usado"];

export const INITIAL_FORM = {
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

export const AD_STORAGE_KEY = "ad_form_data";

// ── Componente principal ─────────────────────────────────────────────────────

export default function StepDetails() {
  const router = useRouter();
  const [form, setForm]                   = useState(INITIAL_FORM);
  const [conditionOpen, setConditionOpen] = useState(false);

  // Lightbox
  const [lbVisible, setLbVisible] = useState(false);
  const [lbIndex, setLbIndex]     = useState(0);

  // Web: referência para o input file oculto
  const fileInputRef = useRef(null);

  // ── Permissões (apenas nativo) ───────────────────────────────────────────
  useEffect(() => {
    if (Platform.OS !== "web") {
      ImagePicker.requestMediaLibraryPermissionsAsync();
    }
  }, []);

  // ── Carrega rascunho salvo ────────────────────────────────────────────────
  useEffect(() => {
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

  // ── Helpers gerais ────────────────────────────────────────────────────────

  function handleUpdate(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleToggleContact(method) {
    setForm((prev) => ({
      ...prev,
      contacts: prev.contacts.includes(method)
        ? prev.contacts.filter((c) => c !== method)
        : [...prev.contacts, method],
    }));
  }

  function handleMaskCep(raw) {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    const masked =
      digits.length > 5
        ? `${digits.slice(0, 5)}-${digits.slice(5)}`
        : digits;
    setForm((prev) => ({ ...prev, cep: masked }));
  }

  // ── Galeria de fotos ──────────────────────────────────────────────────────

  async function handleAddPhoto() {
    if (form.photos.length >= 20) return;

    if (Platform.OS === "web") {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        fileInputRef.current.click();
      }
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.85,
      selectionLimit: 20 - form.photos.length,
    });

    if (!result.canceled && result.assets?.length) {
      const uris = result.assets.map((a) => a.uri);
      setForm((prev) => ({
        ...prev,
        photos: [...prev.photos, ...uris].slice(0, 20),
      }));
    }
  }

  function handleWebFileChange(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const slots = 20 - form.photos.length;
    const toRead = files.slice(0, slots);

    const readers = toRead.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((dataUrls) => {
      const valid = dataUrls.filter(Boolean);
      setForm((prev) => ({
        ...prev,
        photos: [...prev.photos, ...valid].slice(0, 20),
      }));
      if (e.target) e.target.value = "";
    });
  }

  function handleRemovePhoto(index) {
    setForm((prev) => {
      const newPhotos = prev.photos.filter((_, i) => i !== index);
      setLbIndex((i) => Math.min(i, Math.max(0, newPhotos.length - 1)));
      return { ...prev, photos: newPhotos };
    });
  }

  // ── Lightbox ──────────────────────────────────────────────────────────────

  function openLightbox(index) {
    setLbIndex(index);
    setLbVisible(true);
  }

  function lbPrev() {
    setLbIndex((i) => (i - 1 + form.photos.length) % form.photos.length);
  }

  function lbNext() {
    setLbIndex((i) => (i + 1) % form.photos.length);
  }

  // ── Navegação ─────────────────────────────────────────────────────────────

  function handleBack() {
    router.push("/(tabs)");
  }

  async function handleNext() {
  try {
    await AsyncStorage.setItem(
      AD_STORAGE_KEY,
      JSON.stringify(form)
    );

    router.push("/revisa=Anuncio");
  } catch (err) {
    console.log(err);
  }
}

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Header />
         

          <View style={styles.main}>

            {/* Hero */}
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>Fotos e detalhes</Text>
              <Text style={styles.heroSub}>
                Anúncios com fotos vendem até 10× mais rápido.
              </Text>
            </View>

            {/* ── Fotos ── */}
            <View style={styles.section}>
              <Text style={styles.label}>
                Fotos{" "}
                <Text style={styles.labelAccent}>
                  ({form.photos.length}/20)
                </Text>
              </Text>

              {Platform.OS === "web" && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleWebFileChange}
                />
              )}

              <View style={styles.photoGrid}>
                {form.photos.map((uri, index) => (
                  <TouchableOpacity
                    key={`photo-${index}`}
                    style={styles.photoThumb}
                    onPress={() => openLightbox(index)}
                    activeOpacity={0.85}
                  >
                    <Image
                      source={{ uri }}
                      style={styles.photoImg}
                      resizeMode="cover"
                    />
                    <View style={styles.photoIndex}>
                      <Text style={styles.photoIndexText}>{index + 1}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.photoRemove}
                      onPress={() => handleRemovePhoto(index)}
                      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                    >
                      <Text style={styles.photoRemoveText}>×</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}

                {form.photos.length < 20 && (
                  <TouchableOpacity
                    style={styles.photoAdd}
                    onPress={handleAddPhoto}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.photoAddIcon}>📷</Text>
                    <Text style={styles.photoAddLabel}>Adicionar{"\n"}foto</Text>
                  </TouchableOpacity>
                )}
              </View>

              {form.photos.length === 0 && (
                <Text style={styles.photoHint}>
                  Toque em "Adicionar foto" para escolher imagens da galeria.
                </Text>
              )}
            </View>

            {/* ── Título ── */}
            <View style={styles.section}>
              <Text style={styles.label}>
                Título do anúncio <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.title}
                onChangeText={(v) => handleUpdate("title", v)}
                placeholder="Ex: iPhone 13 128GB – Preto – Perfeito estado"
                placeholderTextColor="#999"
                maxLength={70}
              />
              <Text style={styles.counter}>{form.title.length}/70</Text>
            </View>

            {/* ── Descrição ── */}
            <View style={styles.section}>
              <Text style={styles.label}>
                Descrição <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                value={form.description}
                onChangeText={(v) => handleUpdate("description", v)}
                placeholder="Descreva seu produto com detalhes: estado, defeitos, motivo da venda, acessórios incluídos..."
                placeholderTextColor="#999"
                maxLength={6000}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
              <Text style={styles.counter}>{form.description.length}/6000</Text>
            </View>

            {/* ── Preço ── */}
            <View style={styles.section}>
              <Text style={styles.label}>
                Preço <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.currencySymbol}>R$</Text>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={form.price}
                  onChangeText={(v) => handleUpdate("price", v)}
                  placeholder="0,00"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.negotiableRow}>
                <Switch
                  value={form.negotiable}
                  onValueChange={(v) => handleUpdate("negotiable", v)}
                  thumbColor={form.negotiable ? "#A636E9" : "#ccc"}
                  trackColor={{ false: "#555", true: "#d4a8f5" }}
                />
                <Text style={styles.negotiableLabel}>Preço negociável</Text>
              </View>
            </View>

            {/* ── Condição ── */}
            <View style={styles.section}>
              <Text style={styles.label}>Condição</Text>
              <TouchableOpacity
                style={styles.select}
                onPress={() => setConditionOpen((o) => !o)}
              >
                <Text
                  style={[
                    styles.selectText,
                    !form.condition && styles.selectPlaceholder,
                  ]}
                >
                  {form.condition || "Selecione…"}
                </Text>
                <Text style={styles.selectArrow}>
                  {conditionOpen ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>

              {conditionOpen && (
                <View style={styles.dropdown}>
                  {CONDITION_OPTIONS.map((opt, i) => (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.dropdownItem,
                        i === CONDITION_OPTIONS.length - 1 && {
                          borderBottomWidth: 0,
                        },
                      ]}
                      onPress={() => {
                        handleUpdate("condition", opt);
                        setConditionOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownText,
                          form.condition === opt && styles.dropdownTextActive,
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* ── Localização ── */}
            <View style={styles.section}>
              <Text style={styles.label}>
                Localização <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.inputMb]}
                value={form.cep}
                onChangeText={handleMaskCep}
                placeholder="CEP"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={9}
              />
              <TextInput
                style={styles.input}
                value={form.city}
                onChangeText={(v) => handleUpdate("city", v)}
                placeholder="Bairro / Cidade"
                placeholderTextColor="#999"
              />
            </View>

            {/* ── Contato ── */}
            <View style={styles.section}>
              <Text style={styles.label}>Forma de contato</Text>
              <View style={styles.contactRow}>
                {CONTACT_OPTIONS.map((opt) => {
                  const selected = form.contacts.includes(opt.id);
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.contactChip,
                        selected && styles.contactChipActive,
                      ]}
                      onPress={() => handleToggleContact(opt.id)}
                    >
                      <Text
                        style={[
                          styles.contactChipText,
                          selected && styles.contactChipTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ── Navegação ── */}
            <View style={styles.navRow}>
              <TouchableOpacity style={styles.btnBack} onPress={handleBack}>
                <Text style={styles.btnBackText}>← Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnNext} onPress={handleNext}>
                <Text style={styles.btnNextText}>Revisar anúncio →</Text>
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
            {form.photos[lbIndex] ? (
              <Image
                source={{ uri: form.photos[lbIndex] }}
                style={styles.lbImage}
                resizeMode="contain"
              />
            ) : null}

            <Text style={styles.lbCounter}>
              {lbIndex + 1} / {form.photos.length}
            </Text>

            <TouchableOpacity
              style={styles.lbClose}
              onPress={() => setLbVisible(false)}
            >
              <Text style={styles.lbCloseText}>×</Text>
            </TouchableOpacity>

            {form.photos.length > 1 && (
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

            {form.photos.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.lbStrip}
                contentContainerStyle={styles.lbStripContent}
              >
                {form.photos.map((uri, i) => (
                  <TouchableOpacity
                    key={`lb-thumb-${i}`}
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

// ── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030",
  },
  scrollContainer: {
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
    marginBottom: 24,
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
  section: {
    marginBottom: 20,
  },
  label: {
    color: "#d4a8f5",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },
  labelAccent: {
    color: "#A636E9",
  },
  required: {
    color: "#f87171",
  },
  counter: {
    color: "#777",
    fontSize: 11,
    textAlign: "right",
    marginTop: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "rgba(166,54,233,0.35)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#222",
    fontSize: 14,
    fontWeight: "600",
  },
  inputMb: {
    marginBottom: 10,
  },
  textarea: {
    minHeight: 110,
    paddingTop: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    color: "#A636E9",
    fontWeight: "800",
    fontSize: 15,
    marginRight: 8,
  },
  negotiableRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  negotiableLabel: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 8,
  },
  select: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "rgba(166,54,233,0.35)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: {
    color: "#222",
    fontSize: 14,
    fontWeight: "600",
  },
  selectPlaceholder: {
    color: "#999",
  },
  selectArrow: {
    color: "#A636E9",
    fontSize: 12,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "rgba(166,54,233,0.5)",
    borderRadius: 12,
    marginTop: 4,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0e8fb",
  },
  dropdownText: {
    color: "#444",
    fontSize: 14,
    fontWeight: "600",
  },
  dropdownTextActive: {
    color: "#A636E9",
    fontWeight: "800",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  photoThumb: {
    width: 82,
    height: 82,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 8,
    marginBottom: 8,
  },
  photoImg: {
    width: "100%",
    height: "100%",
  },
  photoIndex: {
    position: "absolute",
    bottom: 4,
    left: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  photoIndexText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  photoRemove: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  photoRemoveText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#fff",
    lineHeight: 19,
  },
  photoAdd: {
    width: 82,
    height: 82,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#A636E9",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(166,54,233,0.07)",
    marginBottom: 8,
  },
  photoAddIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  photoAddLabel: {
    color: "#A636E9",
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
  },
  photoHint: {
    color: "#666",
    fontSize: 12,
    marginTop: 10,
    fontStyle: "italic",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  contactChip: {
    borderWidth: 2,
    borderColor: "rgba(166,54,233,0.3)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    marginRight: 10,
    marginBottom: 8,
  },
  contactChipActive: {
    borderColor: "#A636E9",
    backgroundColor: "#f5eaff",
  },
  contactChipText: {
    color: "#444",
    fontSize: 13,
    fontWeight: "700",
  },
  contactChipTextActive: {
    color: "#A636E9",
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
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
  btnNext: {
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
  btnNextText: {
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