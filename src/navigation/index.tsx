// src/navigation/index.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import GachaScreen from "../screens/GachaScreen";
import MissionsScreen from "../screens/MissionsScreen";
import MonstersScreen from "../screens/MonstersScreen";
import MonsterDetail from "../screens/MonsterDetail";
import HistoryScreen from "../screens/HistoryScreen";
import QuestScreen from "../screens/QuestScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Gacha" component={GachaScreen} />
        <Stack.Screen name="Missions" component={MissionsScreen} />
        <Stack.Screen name="Monsters" component={MonstersScreen} />
        <Stack.Screen name="MonsterDetail" component={MonsterDetail} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Quest" component={QuestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
