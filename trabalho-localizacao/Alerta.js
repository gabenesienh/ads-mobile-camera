import { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";

import MapView, {
  Marker,
} from "react-native-maps";

import * as Location from "expo-location";

import * as ImagePicker from "expo-image-picker";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Alerta() {
  const mapaRef = useRef();

  const [minhaPosicao, setMinhaPosicao] =
    useState(null);

  const [tipoSelecionado, setTipoSelecionado] =
    useState("Acidente");

  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    carregarAlertas();

    async function iniciar() {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Permissão negada");
        return;
      }

      const loc =
        await Location.getCurrentPositionAsync({});

      setMinhaPosicao(loc.coords);

      setTimeout(() => {
        mapaRef.current?.animateCamera({
          center: {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          },
          zoom: 16,
        });
      }, 1000);
    }

    iniciar();
  }, []);

  async function carregarAlertas() {
    const dados =
      await AsyncStorage.getItem("alertas");

    if (dados) {
      setAlertas(JSON.parse(dados));
    }
  }

  async function salvarAlertas(lista) {
    setAlertas(lista);

    await AsyncStorage.setItem(
      "alertas",
      JSON.stringify(lista)
    );
  }

  async function tirarFoto() {
    if (!minhaPosicao) return;

    const permissao =
      await ImagePicker.requestCameraPermissionsAsync();

    if (permissao.status !== "granted") {
      alert("Permissão da câmera negada");
      return;
    }

    const resultado =
      await ImagePicker.launchCameraAsync({
        quality: 1,
      });

    if (resultado.canceled) return;

    const novoAlerta = {
      id: Date.now(),
      tipo: tipoSelecionado,
      foto: resultado.assets[0].uri,
      latitude: minhaPosicao.latitude,
      longitude: minhaPosicao.longitude,
    };

    const novaLista = [
      ...alertas,
      novoAlerta,
    ];

    salvarAlertas(novaLista);

    alert("Alerta enviado");
  }

  function pegarEmoji(tipo) {
    if (tipo === "Acidente") return "🚨";

    if (tipo === "Blitz") return "🚔";

    if (tipo === "Buraco") return "🕳️";

    return "⚠️";
  }

  if (!minhaPosicao) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapaRef}
        style={{ flex: 1 }}
        showsUserLocation
        initialRegion={{
          latitude: minhaPosicao.latitude,
          longitude: minhaPosicao.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {alertas.map((item) => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            title={item.tipo}
          />
        ))}
      </MapView>

      <View style={styles.topo}>
        <Text style={styles.logo}>
          Alertas
        </Text>

        <Text style={styles.subtitulo}>
          Envie ocorrências da rua
        </Text>
      </View>

      <View style={styles.painel}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[
              styles.botaoTipo,
              tipoSelecionado === "Acidente" &&
                styles.botaoAtivo,
            ]}
            onPress={() =>
              setTipoSelecionado("Acidente")
            }
          >
            <Text style={styles.textoTipo}>
              🚨 Acidente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botaoTipo,
              tipoSelecionado === "Blitz" &&
                styles.botaoAtivo,
            ]}
            onPress={() =>
              setTipoSelecionado("Blitz")
            }
          >
            <Text style={styles.textoTipo}>
              🚔 Blitz
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botaoTipo,
              tipoSelecionado === "Buraco" &&
                styles.botaoAtivo,
            ]}
            onPress={() =>
              setTipoSelecionado("Buraco")
            }
          >
            <Text style={styles.textoTipo}>
              🕳️ Buraco
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          style={styles.botaoCamera}
          onPress={tirarFoto}
        >
          <Text style={styles.textoCamera}>
            📷 Tirar foto e enviar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#fff",
    fontSize: 18,
  },

  topo: {
    position: "absolute",
    top: 60,
    left: 20,
  },

  logo: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },

  subtitulo: {
    color: "#ccc",
    marginTop: 4,
  },

  painel: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    paddingHorizontal: 15,
  },

  botaoTipo: {
    backgroundColor: "#1b1b1b",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 15,
  },

  botaoAtivo: {
    backgroundColor: "#2d8cff",
  },

  textoTipo: {
    color: "#fff",
    fontWeight: "bold",
  },

  botaoCamera: {
    backgroundColor: "#ff9500",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  textoCamera: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});