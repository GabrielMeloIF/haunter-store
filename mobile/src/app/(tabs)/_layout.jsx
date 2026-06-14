import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { UserProvider } from '../../components/context/userContext';
import { AdsProvider } from '../../components/context/AdsContext';
import { useAuth } from '../../components/context/authContext';

export default function Layout() {
  const { usuario } = useAuth();
  const isAdmin = usuario?.tipo === 'ADMIN';

  return (
    <AdsProvider>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: '#A636E9', marginBottom: 0, height: 60 },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#aaa',
          tabBarIcon: ({ color, size, focused }) => {
            const icons = {
              index: 'home',
              carrinho: 'cart',
              favoritos: 'heart',
              user: 'person',
              conversas: 'chatbubbles',
              anuncios: 'grid-outline',
              admin: 'skull-outline',
            };

            return (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name={icons[route.name]} size={27} color={color} />
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
        <Tabs.Screen name="comprar" options={{ href: null }} />
        <Tabs.Screen name="favoritos" options={{ title: 'Favoritos' }} />
        <Tabs.Screen name="carrinho" options={{ title: 'Carrinho' }} />
        <Tabs.Screen name="conversas" options={{ title: 'Conversas' }} />
        <Tabs.Screen name="user" options={{ title: 'Perfil' }} />
        <Tabs.Screen name="jogos" options={{ href: null }} />
        <Tabs.Screen name="perifericos" options={{ href: null }} />
        <Tabs.Screen name="consoles" options={{ href: null }} />
        <Tabs.Screen name="pcs" options={{ href: null }} />
        <Tabs.Screen name="anuncios" options={{ title: 'Anúncios' }} />
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Admin',
            href: isAdmin ? undefined : null,
          }}
        />
      </Tabs>
    </AdsProvider>
  );
}