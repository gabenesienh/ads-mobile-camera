import { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function App() {
  const [ultimaFoto, setUltimaFoto] = useState(null);
  const cameraRef = useRef();
  const [permission, requestCameraPermission] = useCameraPermissions();

  async function quandoInicializa() {
    await requestCameraPermission();
  }

  async function quandoPressionaObturador() {
    const camera = cameraRef.current;
    const foto = await camera.takePictureAsync();
    setUltimaFoto(foto.uri);
  }

  useEffect(() => {
    quandoInicializa();
  }, []);

  if (permission === null || !permission.granted) {
    return (
      <View>
        <Text>Permissão de câmera não foi concedida :(</Text>
      </View>
    );
  }

  const cameraPreview = ultimaFoto !== null && (
    <Image
      style={styles.cameraPreview}
      source={{
        uri: ultimaFoto,
      }}
    />
  );

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <TouchableOpacity
        style={styles.obturador}
        onPress={quandoPressionaObturador}
      >
        <AntDesign name="aim" size={64} color="red" />
      </TouchableOpacity>
      {cameraPreview}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  obturador: {
    position: "absolute",
    bottom: 24,
    left: "50%",
    zIndex: 10,
    backgroundColor: "transparent",
    width: 96,
    height: 96,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -52,
    borderRadius: 48,
    borderWidth: 8,
    borderColor: "red",
  },
  cameraPreview: {
    width: 200,
    height: 150,
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
  },
});
