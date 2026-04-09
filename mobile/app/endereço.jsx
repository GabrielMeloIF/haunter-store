const EtapaEndereco = ({ endereco, setEndereco, buscarCep, buscandoCep, formatarCep, setEtapa }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>📍 Endereço de entrega</Text>

    <TextInput
      style={styles.campoInput}
      placeholder="CEP"
      value={endereco.cep}
      onChangeText={(v) => {
        const fmt = formatarCep(v);
        setEndereco((p) => ({ ...p, cep: fmt }));
        buscarCep(fmt);
      }}
    />

    <TextInput
      style={styles.campoInput}
      placeholder="Rua"
      value={endereco.rua}
      onChangeText={(v) => setEndereco((p) => ({ ...p, rua: v }))}
    />

    <TextInput
      style={styles.campoInput}
      placeholder="Número"
      value={endereco.numero}
      onChangeText={(v) => setEndereco((p) => ({ ...p, numero: v }))}
    />

    <TouchableOpacity
      style={styles.btnPrimary}
      onPress={() => setEtapa(2)}
    >
      <Text style={styles.btnPrimaryText}>Continuar</Text>
    </TouchableOpacity>
  </View>
);