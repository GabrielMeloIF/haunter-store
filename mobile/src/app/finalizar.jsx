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

const AD_STORAGE_KEY = "ad_form_data";

const INITIAL_FORM = {
  category: "",
  subcategory: "",
  title: "",
  description: "",
  price: "",
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
        const saved = await AsyncStorage.getItem(
          AD_STORAGE_KEY
        );

        if (saved) {
          const parsed = JSON.parse(saved);

          setForm((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      } catch (_) {}
    })();
  }, []);

  const formattedPrice =
    form.price && !isNaN(Number(form.price))
      ? "R$ " +
        Number(form.price).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })
      : "A combinar";

  const rawDesc = form.description ?? "";

  const shortDesc =
    rawDesc.length > 0
      ? rawDesc.slice(0, 120) +
        (rawDesc.length > 120 ? "..." : "")
      : "(sem descrição)";

  function openLightbox(index) {
    if (!form.photos?.length) return;

    setLbIndex(
      Math.min(index, form.photos.length - 1)
    );

    setLbVisible(true);
  }

  function lbPrev() {
    setLbIndex(
      (i) =>
        (i - 1 + form.photos.length) %
        form.photos.length
    );
  }

  function lbNext() {
    setLbIndex(
      (i) => (i + 1) % form.photos.length
    );
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

   function handlePublish() {
  if (props.onPublish) {
      props.onPublish();
    } else {
      router.push("/meus-anuncios");
    }

    try {
      const response = await fetch(
        "http://192.168.56.1:4000/marketplace",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ...form,
          }),
        }
      );

      const data = await response.json();

      console.log("STATUS:", response.status);
      console.log("RESPOSTA:", data);

      if (!response.ok) {
        return;
      }

      await AsyncStorage.removeItem(
        AD_STORAGE_KEY
      );

      router.push("/meus-anuncios");
    } catch (err) {
      console.log("ERRO:", err);
    }
  }

  const photos = form.photos ?? [];

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Header />

          <View style={styles.main}>
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>
                Revise seu anúncio
              </Text>

              <Text style={styles.heroSub}>
                Veja como ficará para os
                compradores antes de publicar.
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.photoBox}>
                {photos.length > 0 ? (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        openLightbox(0)
                      }
                      activeOpacity={0.9}
                    >
                      <Image
                        source={{
                          uri: photos[0],
                        }}
                        style={styles.photoMain}
                        resizeMode="cover"
                      />

                      {photos.length > 1 && (
                        <View
                          style={
                            styles.photoBadge
                          }
                        >
                          <Text
                            style={
                              styles.photoBadgeText
                            }
                          >
                            📷 {photos.length}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    {photos.length > 1 && (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={
                          false
                        }
                        style={styles.photoStrip}
                        contentContainerStyle={
                          styles.photoStripContent
                        }
                      >
                        {photos
                          .slice(1)
                          .map((uri, i) => (
                            <TouchableOpacity
                              key={`strip-${i}`}
                              onPress={() =>
                                openLightbox(
                                  i + 1
                                )
                              }
                            >
                              <Image
                                source={{ uri }}
                                style={
                                  styles.photoThumb
                                }
                                resizeMode="cover"
                              />
                            </TouchableOpacity>
                          ))}
                      </ScrollView>
                    )}
                  </>
                ) : (
                  <View
                    style={styles.photoEmpty}
                  >
                    <Text
                      style={
                        styles.photoEmptyIcon
                      }
                    >
                      🖼️
                    </Text>

                    <Text
                      style={
                        styles.photoEmptyText
                      }
                    >
                      Sem imagem
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.adTitle}>
                  {form.title ||
                    "(sem título)"}
                </Text>

                <View style={styles.priceRow}>
                  <Text
                    style={styles.adPrice}
                  >
                    {formattedPrice}
                  </Text>

                  {form.negotiable && (
                    <Text
                      style={
                        styles.negotiableBadge
                      }
                    >
                      negociável
                    </Text>
                  )}
                </View>

                <Text style={styles.adDesc}>
                  {shortDesc}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.termsRow}
              onPress={handleToggleTerms}
            >
              <View
                style={[
                  styles.checkbox,
                  terms &&
                    styles.checkboxChecked,
                ]}
              >
                {terms && (
                  <Text
                    style={styles.checkmark}
                  >
                    ✓
                  </Text>
                )}
              </View>

              <Text style={styles.termsText}>
                Li e aceito os{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() =>
                    Linking.openURL(
                      "https://seusite.com/termos"
                    )
                  }
                >
                  Termos de Uso
                </Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.navRow}>
              <TouchableOpacity
                style={styles.btnBack}
                onPress={() =>
                  router.push("/anunciar")
                }
              >
                <Text
                  style={styles.btnBackText}
                >
                  ← Voltar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.btnPublish,
                  !terms &&
                    styles
                      .btnPublishDisabled,
                ]}
                onPress={handlePublish}
                disabled={!terms}
              >
                <Text
                  style={
                    styles.btnPublishText
                  }
                >
                  Publicar anúncio
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{
                marginTop: 20,
                alignSelf: "center",
              }}
              onPress={() =>
                router.push("/comprar")
              }
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Ir para comprar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={lbVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setLbVisible(false)
        }
      >
        <Pressable
          style={styles.lbOverlay}
          onPress={() =>
            setLbVisible(false)
          }
        >
          <Pressable
            style={styles.lbContainer}
          >
            {photos[lbIndex] ? (
              <Image
                source={{
                  uri: photos[lbIndex],
                }}
                style={styles.lbImage}
                resizeMode="contain"
              />
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030"

  },
  icon: {
    marginTop: 32,
    color: "#A636E9"
  },
  titulo: {
    color: "#fff",
    fontSize: 30,
    marginTop: 32,
    paddingHorizontal: 16,
    fontWeight: "bold"
  },
  formulario: {
    marginTop: 32,
    backgroundColor: "#292929",
    borderRadius: 10,
    width: "85%",
    height: 410,
    display: "flex",
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: "column",
    marginBottom: 32,
    alignSelf: "center",
    border: "0.5px solid #A636E9",
  },
  endereço: {
    color: "#fff",
    margin: 10,
    marginLeft: 23,
  },
  inputs: {
    backgroundColor: "#D9D9D9",
    borderRadius: 7,
    width: 300,
    height: 40,
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 14,
    marginBottom: 10,
    padding: 3,
    color: "#4f4f4f",
  },
  btnP: {
    backgroundColor: "#A636E9",
    padding: 8,
    borderRadius: 10,
    color: "#fff",
    width: 100,
    height: 45,
    marginBotom: 20,
    paddingHorizontal: 17,
    paddingVertical: 11,
    margin: 12,
    marginRight: 28,
    fontWeight: "bold",
    fontSize: 16,
  },
  btnV: {
    backgroundColor: "#555",
    width: 82,
    height: 45,
    borderRadius: 10,
    color: "#fff",
    paddingHorizontal: 17,
    paddingVertical: 11,
    display: "flex",
    margin: 13,
    marginLeft: 32,
    fontWeight: "bold",
    fontSize: 16,
  }

});