// src/components/Monster.tsx
import React from "react";
import { View, Animated, StyleSheet, Text } from "react-native";
import { useGame } from "../context/GameContext";
import { monsterAssetMap } from "../utils/monsterAssets";
import { getMonsterEvolutionName } from "../utils/monsterEvolution";

export const Monster: React.FC = () => {
  const {
    monsters,
    selectedMonsterId,
    getCurrentMonsterCondition,
  } = useGame();

  const primary = selectedMonsterId
    ? monsters.find((m) => m.id === selectedMonsterId) || monsters[0]
    : monsters[0];

  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (!primary) return;

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.08 + primary.level * 0.01,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [primary?.level]);

  if (!primary) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>
          まだモンスターがいません。ガチャで仲間を増やそう！
        </Text>
      </View>
    );
  }

  const getHomeImageForLevel = (level: number) => {
    if (level >= 100) return monsterAssetMap.FinalDarkValdHome;
    if (level >= 75) return monsterAssetMap.ChaosValdHome;
    if (level >= 50) return monsterAssetMap.NightVelosHome;
    if (level >= 25) return monsterAssetMap.ShadowlHome;
    return monsterAssetMap.DarkletHome;
  };

  const conditionInfo = getCurrentMonsterCondition();
  const imgSource = getHomeImageForLevel(primary.level);

  return (
    <View style={styles.container}>
      {conditionInfo.message && (
        <View style={styles.balloon}>
          <Text style={styles.balloonText}>{conditionInfo.message}</Text>
        </View>
      )}

      <Animated.Image
        source={imgSource}
        style={[styles.image, { transform: [{ scale }] }]}
        resizeMode="contain"
      />

      <Text style={styles.name}>
        {getMonsterEvolutionName(primary.level)} Lv{primary.level}
      </Text>

      <Text style={styles.sub}>
        HP {primary.stats.hp} • ATK {primary.stats.atk} • DEF {primary.stats.def} • SPD{" "}
        {primary.stats.speed}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  emptyText: {
    color: "#cbd5e1",
  },

  balloon: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },

  balloonText: {
    color: "#111827",
    fontWeight: "700",
  },

  image: {
    width: 220,
    height: 220,
    backgroundColor: "transparent",
  },

  name: {
    color: "#fff",
    marginTop: 8,
    fontWeight: "700",
  },

  sub: {
    color: "#9ca3af",
    marginTop: 4,
  },
});