// mobile/src/App.tsx
import "react-native-get-random-values";
import React from "react";
import { SafeAreaView, StatusBar as RNStatusBar, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GameProvider } from "./context/GameContext";
import AppNavigator from "./navigation";

export default function App() {
  return (
    <GameProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#0f1724" }}>
          <RNStatusBar
            barStyle="light-content"
            backgroundColor={Platform.OS === "android" ? "#0f1724" : undefined}
          />
          <AppNavigator />
        </SafeAreaView>
      </GestureHandlerRootView>
    </GameProvider>
  );
}
