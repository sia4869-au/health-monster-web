// src/components/Monster.tsx
import React from "react";
import { View, Animated, Image, StyleSheet, Text } from "react-native";
import { useGame } from "../context/GameContext";
import { monsterAssetMap } from "../utils/monsterAssets";

export const Monster: React.FC = () => {
  const { monsters, selectedMonsterId } = useGame();
  const primary = selectedMonsterId ? monsters.find((m) => m.id === selectedMonsterId) || monsters[0] : monsters[0];
  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (!primary) return;
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.08 + primary.level * 0.01, duration: 400, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [primary?.level]);

  if (!primary) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#cbd5e1" }}>まだモンスターがいません。ガチャで仲間を増やそう！</Text>
      </View>
    );
  }

  const getImageForLevel = (level: number) => {
    if (level >= 100 && monsterAssetMap["FinalDarkValdHome"]) return monsterAssetMap["FinalDarkValdHome"];
    if (level >= 75 && monsterAssetMap["ChaosValdHome"]) return monsterAssetMap["ChaosValdHome"];
    if (level >= 50 && monsterAssetMap["NightVelosHome"]) return monsterAssetMap["NightVelosHome"];
    if (level >= 25 && monsterAssetMap["ShadowlHome"]) return monsterAssetMap["ShadowlHome"];
    return monsterAssetMap["DarkletHome"] || monsterAssetMap[primary.name] || require("../../assets/monster_stage1.png");
  };

  const imgSource = getImageForLevel(primary.level);

  return (
    <View style={styles.container}>
      <Animated.Image source={imgSource} style={[styles.image, { transform: [{ scale }] }]} resizeMode="contain" />
      <Text style={styles.name}>{primary.name} Lv{primary.level}</Text>
      <Text style={styles.sub}>HP {primary.stats.hp} • ATK {primary.stats.atk} • DEF {primary.stats.def} • SPD {primary.stats.speed}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", marginTop: 20 },
  image: { width: 220, height: 220, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 10 },
  name: { color: "#fff", marginTop: 8, fontWeight: "700" },
  sub: { color: "#9ca3af", marginTop: 4 },
});
