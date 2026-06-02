import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { UserProvider } from "../components/context/userContext";
import { AuthProvider, useAuth } from "../components/context/authContext";
import { SearchProvider } from "../components/context/searchContext";

// Componente que cuida da proteção de rotas
function ProtecaoRota({ children }) {
  const { estaLogado, carregando } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (carregando) return;

    const rotaProtegida = segments[0] === "(tabs)";
    const naTelaDeAuth =
      segments[0] === "login" || segments[0] === "register";

    // Se tiver na aba e não estiver logado → manda pro login
    // (ajuste aqui conforme o nível de proteção que você quiser)
    // Por ora, o app deixa entrar como guest normalmente.
    // Descomente abaixo para exigir login obrigatório:

    // if (!estaLogado && rotaProtegida) {
    //   router.replace("/login");
    // }

    // Se estiver logado e na tela de auth → redireciona pro app
    if (estaLogado && naTelaDeAuth) {
      router.replace("/(tabs)");
    }
  }, [estaLogado, carregando, segments]);

  return children;
}

export default function Layout() {
  return (
    <AuthProvider>
      <UserProvider>
        <SearchProvider>
          <ProtecaoRota>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ headerShown: false }} />
              <Stack.Screen name="finalizar" options={{ headerShown: false }} />
              <Stack.Screen name="pagamento" options={{ headerShown: false }} />
              <Stack.Screen
                name="confirmacao"
                options={{ headerShown: false }}
              />
            </Stack>
          </ProtecaoRota>
        </SearchProvider>
      </UserProvider>
    </AuthProvider>
  );
}