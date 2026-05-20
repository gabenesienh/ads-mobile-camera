import { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";

import MapView, {
  Marker,
  Callout,
} from "react-native-maps";

import * as Location from "expo-location";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Mapa() {
  const mapaRef = useRef();

  const [minhaPosicao, setMinhaPosicao] =
    useState(null);

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
          Carregando mapa...
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
          >
            <View style={styles.marker}>
              <Text style={{ fontSize: 22 }}>
                {pegarEmoji(item.tipo)}
              </Text>
            </View>

            <Callout>
              <View style={styles.callout}>
                <Text style={styles.tipo}>
                  {item.tipo}
                </Text>

                <Image
                  source={{ uri: item.foto }}
                  style={styles.imagem}
                />
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.topo}>
        <Text style={styles.subtitulo}>
          Visualização dos alertas
        </Text>
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
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitulo: {
    color: "#ccc",
    marginTop: 4,
  },

  marker: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#2d8cff",
  },

  callout: {
    width: 200,
    padding: 10,
  },

  tipo: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },

  imagem: {
    width: 180,
    height: 120,
    borderRadius: 10,
  },
});