import { Stack } from 'expo-router';
import { UserProvider } from '../src/components/context/userContext';

export default function Layout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="comprar" options={{ headerShown: false }} />
        <Stack.Screen name="jogos" options={{ headerShown: false }} />
        <Stack.Screen name="perifericos" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="finalizar" options={{ headerShown: false }} />
        <Stack.Screen name="pagamento" options={{ headerShown: false }} />
        <Stack.Screen name="confirmacao" options={{ headerShown: false }} />
        <Stack.Screen name="revisar-anuncios" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}