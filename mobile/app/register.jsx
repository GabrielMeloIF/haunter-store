import { 
    View,
    Text,
    Image,
    StyleSheet
} from "react-native";
import { TextInput } from "react-native-web"
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Register() {  
    
    const router = useRouter()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [avatar, setAvatar] = useState("")

    const handleSubmit = async () => {
    console.log({name, email, pass, avatar})
    const response = await fetch("http://localhost:3000/user", {
      method: "Post",
      headers: { 
        "Content-type": "application/json" 
        },
        body: JSON.stringify({name, email, pass, avatar})
    })

    if(response.ok) {
      console.log("Usuário cadastrado com sucesso!")
      const data = await response.json()
      console.log(data)
    } else {
      console.log("Erro ao cadastrar usuário")
    }
  }

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <View style={styles.form}>
        <TextInput 
            style={styles.inputs} 
            placeholder="Nome"
            value={name}
            onChangeText={setName}
        />
        <TextInput 
            style={styles.inputs} 
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
        />
        <TextInput 
            style={styles.inputs} 
            placeholder="Senha" 
            secureTextEntry
            value={pass}
            onChangeText={setPass}
        />
        <TextInput 
            style={styles.inputs} 
            placeholder="avatar" 
            value={avatar}
            onChangeText={setAvatar}
        />
        <Button title="Cadastrar" onPress={handleSubmit} />
        <Button title="Cancelar" onPress={() => router.push('/')} />
      </View>
    </View>
  )
}