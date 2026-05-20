import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Text } from "react-native";

import Mapa from "./Mapa";
import Alerta from "./Alerta";
import Config from "./Config";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: () => {
            if (route.name === "Mapa") return <Text>🗺️</Text>;

            if (route.name === "Alertas")
              return <Text>⚠️</Text>;

            if (route.name === "Config")
              return <Text>⚙️</Text>;
          },
        })}
      >
        <Tab.Screen
          name="Mapa"
          component={Mapa}
        />

        <Tab.Screen
          name="Alertas"
          component={Alerta}
        />

        <Tab.Screen
          name="Config"
          component={Config}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
} 