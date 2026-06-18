import { 
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "react-native";
import UserCard from "../../components/usercard/userCard";
import Header from "../../components/header";
import { useRouter } from "expo-router";

export default function App() {
    const router = useRouter();

    return (
        <View style={styles.UserPage}>
            <Header />
            <UserCard />
        </View>
    )
}

const styles = StyleSheet.create({
    UserPage: {
        backgroundColor: '#2F2F2F',
        flex: 1
    },

  
})