import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from '../src/components/header/index';

// importe suas telas
import HomeScreen from './favoritos';
import ProfileScreen from './comprar';

const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        screenOptions={{
          header: () => <Header />,
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}