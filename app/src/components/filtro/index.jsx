import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState, useRef, useEffect } from "react"; 
import { StyleSheet, Text, View, Animated } from 'react-native'; 
import { useRouter } from "expo-router";

export default function Filtro() {  
    const router = useRouter();
    const [filtro, setFiltro] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current; 

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: filtro ? 1 : 0, 
            duration: 300,    
            useNativeDriver: true,
        }).start();
    }, [filtro]); 

    return (
        <View style={{ zIndex: 1000 }}>
           
            <FontAwesome 
                name="filter" 
                size={24} 
                color={filtro ? "#000" : "#FFF"} 
                style={{ marginTop: 20, marginLeft: 20, zIndex: 1001 }} 
                onPress={() => setFiltro(!filtro)} 
            />

           
            <Animated.View 
                pointerEvents={filtro ? "auto" : "none"} 
                style={[styles.filtros, { opacity: fadeAnim }]}
            >
                 <Text style={styles.filtro1} onPress={() => { setFiltro(false); router.push('jogos'); }}>Jogos</Text>
                 <Text style={styles.filtro1} onPress={() => { setFiltro(false); router.push('perifericos'); }}>Periféricos</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    filtros: {
        backgroundColor: "#ffff",
        width: 150,
        zIndex: 1000,
        position: "absolute",
        marginTop: 50,
        marginLeft: 20,
        borderRadius: 8,
        padding: 10,
    },
    filtro1: {
        paddingVertical: 8,
        fontSize: 14,
    }
});
