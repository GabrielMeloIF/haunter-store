import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { UserProvider } from '../src/components/context/userContext'; // ajusta o caminho

export default function Layout() {
  return (
   < UserProvider>
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#A636E9', marginBottom: 0, height: 50 },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#aaa',
        tabBarIcon: ({ color, size, focused }) => {
  const icons = {
    index: 'home',
    carrinho: 'cart',
    favoritos: 'heart',
    user: 'person',
    conversas: 'chatbubbles',
  };
  
  return (
    <View style={{ alignItems: 'center' }}>
      <Ionicons name={icons[route.name]} size={size} color={color} />
      {focused && (
        <View style={{
          width: 20,
          height: 2,
          backgroundColor: '#fff',
          borderRadius: 2,
          marginTop: 3,
        }} />
      )}
    </View>
  );
},
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="favoritos" options={{ title: 'Favoritos' }} />
      <Tabs.Screen name="carrinho" options={{ title: 'Carrinho' }} />
      <Tabs.Screen name="conversas" options={{ title: 'Conversas' }} />
      <Tabs.Screen name="user" options={{ title: 'Perfil' }} />
      <Tabs.Screen name="comprar" options={{ href: null}} />
      <Tabs.Screen name="jogos" options={{ href: null}} />
      <Tabs.Screen name="perifericos" options={{ href: null}} />
      <Tabs.Screen name="login" options={{ href: null}} />
      <Tabs.Screen name="register" options={{ href: null}} />
      <Tabs.Screen name="finalizar" options={{ href: null}} />
      <Tabs.Screen name="pagamento" options={{ href: null}} />
      <Tabs.Screen name="confirmacao" options={{ href: null}} />
      <Tabs.Screen name="anunciar" options={{ href: null}} />
      <Tabs.Screen name="anunciar2" options={{ href: null}} />
    </Tabs>
    </UserProvider>
  );
}
