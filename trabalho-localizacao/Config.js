import { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import * as ImagePicker from "expo-image-picker";

export default function Config() {
  const [nome, setNome] = useState("");

  const [foto, setFoto] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const nomeSalvo =
      await AsyncStorage.getItem("nome_usuario");

    const fotoSalva =
      await AsyncStorage.getItem("foto_usuario");

    if (nomeSalvo) setNome(nomeSalvo);

    if (fotoSalva) setFoto(fotoSalva);
  }

  async function salvarDados() {
    await AsyncStorage.setItem(
      "nome_usuario",
      nome
    );

    if (foto) {
      await AsyncStorage.setItem(
        "foto_usuario",
        foto
      );
    }

    alert("Perfil salvo");
  }

  async function escolherFoto() {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permissão negada");
      return;
    }

    const resultado =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

        quality: 1,
      });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  }

  async function limparDados() {
    await AsyncStorage.clear();

    setNome("");
    setFoto(null);

    alert("Dados removidos");
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.titulo}>
        Configurações
      </Text>

      <Text style={styles.label}>
        Seu nome
      </Text>

      <TextInput
        placeholder="Digite seu nome"
        placeholderTextColor="#777"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.fotoContainer}
        onPress={escolherFoto}
      >
        {foto ? (
          <Image
            source={{ uri: foto }}
            style={styles.foto}
          />
        ) : (
          <Text style={styles.mais}>+</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoSalvar}
        onPress={salvarDados}
      >
        <Text style={styles.textoBotao}>
          Salvar perfil
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoLimpar}
        onPress={limparDados}
      >
        <Text style={styles.textoBotao}>
          Limpar dados
        </Text>
      </TouchableOpacity>

      <View style={styles.cardInfo}>
        <Text style={styles.versao}>
          Versão 1.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,  
  },

  titulo: {
    color: "#111",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
  },

  label: {
    color: "#111",
    fontSize: 16,
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#f1f1f1",
    color: "#111",
    padding: 15,
    borderRadius: 18,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  fotoContainer: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: "#2a2a2a",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#2d8cff",
    overflow: "hidden",

    marginTop: 30,

    shadowColor: "#2d8cff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,

    elevation: 10,
  },

  foto: {
    width: "100%",
    height: "100%",
  },

  mais: {
    color: "#2d8cff",
    fontSize: 45,
    fontWeight: "bold",
  },

  botaoSalvar: {
    backgroundColor: "#2d8cff",
    padding: 16,
    borderRadius: 18,
    marginTop: 30,
    alignItems: "center",
  },

  botaoLimpar: {
    backgroundColor: "#ff3b30",
    padding: 16,
    borderRadius: 18,
    marginTop: 15,
    alignItems: "center",
  },

  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  cardInfo: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 20,
    marginTop: 35,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },

  infoTitulo: {
    color: "#111",
    fontSize: 20,
    fontWeight: "bold",
  },

  infoTexto: {
    color: "#555",
    marginTop: 10,
    lineHeight: 22,
  },

  versao: {
    color: "#777",
    marginTop: 15,
  },
});