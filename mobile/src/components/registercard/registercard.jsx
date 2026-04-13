import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import { TextInput } from "react-native-web"
import { useRouter } from "expo-router";
//import { useState } from "react";


export default function Register() {

  const router = useRouter();

    return (
    <View style={styles.container}>
        <Text style={styles.title}>Registre-se</Text>
        <View>
            <TextInput 
                style={styles.inputs} 
                placeholder="Nome"
            />

            <TextInput 
                style={styles.inputs} 
                placeholder="Email"
            />
            <TextInput 
                style={styles.inputs} 
                placeholder="Senha" 
                secureTextEntry
            />
            <TextInput 
                style={styles.inputs} 
                placeholder="Confirme a senha" 
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <Text style={styles.backButton} onPress={() => router.push('/')}>
                    Voltar
                </Text>
                <Text style={styles.registerButton} onPress={() => router.push('/user')}>
                    Cadastrar
                </Text>
            </View>
        </View>
        <Text style={styles.loginText}>Já tem conta? <Text style={styles.loginLink} onPress={() => router.push('/login')}>Entre já</Text></Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#7D7D7D',
      alignItems: 'center',
      justifyContent: 'center',
      maxHeight: '10%',
      padding: 20,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 20,
    },
    inputs: {
        width: '100%',
        padding: 10,
        backgroundColor: '#D9D9D9',
        marginBottom: 10,
        borderRadius: 30,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        width: '100%',
        marginTop: 20,
    },
    backButton: {
        backgroundColor: '#D9D9D9',
        paddingHorizontal: 20,
        paddingVertical: 5,
        color: '#000',
        borderRadius: 30, 
    },
    registerButton: {
        backgroundColor: '#430883',
        paddingHorizontal: 20,
        paddingVertical: 5,
        color: '#fff',
        borderRadius: 30,
    },
    loginText: {
        marginTop: 20,
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    loginLink: {
        color: '#691CA3',
        fontWeight: 'bold'
    }  
  })