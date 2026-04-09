import Header from "../src/components/header";
import { View, Text, StyleSheet, TextInput } from "react-native"; 
import MaterialIcons from '@expo/vector-icons/MaterialIcons';



export default function Finalizar() {
  return (
    <View style={styles.container}>
      <Header />
       <View style={{display: "flex", flexDirection: "row", marginTop:32, alignItems: "center", justifyContent: "center"}}>
        <MaterialIcons name="place" size={24} color="white" style={styles.icon}/>
      <Text style={styles.titulo}>Endereço</Text>
        </View> 

      <View style={styles.formulario}>
       
          <Text style={styles.endereço}>Endereço</Text>
       
          <TextInput 
              style={styles.inputs}
              placeholder="Rua Ex: Av. Paulista, 1000"
                      />

            <Text style={styles.endereço}>Nº</Text>
                      <TextInput 
              style={styles.inputs}
              placeholder="Ex:109"
                      />

                       <Text style={styles.endereço}>CEP</Text>
                      <TextInput 
              style={styles.inputs}
              placeholder="Ex: 00000-000"
                      />

                      <Text style={styles.endereço}>Complemento</Text>
                      <TextInput 
              style={styles.inputs}
              placeholder="Ex: condomínio..."
                      />


                
      </View>
     
      <Text style={styles.btnP}>Proximo</Text>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030"

},
icon:{
    marginTop: 32,
    color: "#A636E9"
},
titulo:{
    color: "#fff",
    fontSize: 30,
    marginTop: 32,
    paddingHorizontal: 16,
    fontWeight: "bold"
},
formulario:{
    marginTop: 32,
    backgroundColor: "#292929",
    borderRadius:10,
    width:350,
    height: 380,
    display: "flex",
    marginLeft: 'auto',
    marginRight: 'auto',  
    flexDirection: "column", 
    marginBottom:32, 
    alignSelf: "center",
    border: "0.2px solid #A636E9",
},
endereço:{
    color: "#fff",
    margin:10,
    marginLeft: 23,
},
inputs:{
    backgroundColor: "#D9D9D9",
    borderRadius: 7,
    width: 300,
    height: 40,
    marginLeft: 'auto',
    marginRight: 'auto', 
    fontSize: 14,
    marginBottom: 10,
    padding:3,
    color: "#4f4f4f",
},
btnP:{
    backgroundColor: "#A636E9",
    padding: 8,
    borderRadius: 10,
    color: "#fff",
    width: 90,
    height: 40,
    marginBottom: 20, 
    paddingHorizontal: 14,
    paddingVertical: 20,
    fontWeight: "bold",
    alignSelf: "end",
    margin:12,
    display: "flex",
    alignItems: "center",   
},

});