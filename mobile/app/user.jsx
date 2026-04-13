import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "react-native";
import UserCard from "../src/components/usercard/userCard";
import Header from "../src/components/header";

export default function App() {
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
    }
})