import { 
    View,
    Text,
    StyleSheet,
    TextInput
} from "react-native";
import { useRouter } from "expo-router";


export default function Login() {

  const router = useRouter();

    return (
    <View style={styles.container}>
        <Text style={styles.title}>Entrar</Text>
        <View>
            <TextInput 
                style={styles.inputs} 
                placeholder="Email"
            />
            <TextInput 
                style={styles.inputs} 
                placeholder="Senha" 
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <Text style={styles.backButton} onPress={() => router.push('/')}>
                    Voltar
                </Text>
                <Text style={styles.loginButton} onPress={() => router.push('/')}>
                    Logar
                </Text>
            </View>
        </View>
        <Text style={styles.registerText}>Ainda não possui conta?</Text>
        <Text style={styles.registerLink} onPress={() => router.push('/register')}>Crie uma já</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#7D7D7D',
      alignItems: 'center',
      justifyContent: 'center',
      maxHeight: '100%',
      padding: 20,
      borderRadius: 30,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 20,
    },
    inputs: {
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
    loginButton: {
        backgroundColor: '#430883',
        paddingHorizontal: 20,
        paddingVertical: 5,
        color: '#fff',
        borderRadius: 30,
    },
    registerText: {
        marginTop: 20,
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    registerLink: {
        color: '#691CA3',
        fontWeight: 'bold'
    }  
  })