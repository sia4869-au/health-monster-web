// src/screens/MonsterDetail.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useGame } from "../context/GameContext";
import { useRoute, useNavigation } from "@react-navigation/native";
import { monsterAssetMap } from "../utils/monsterAssets";
import { getMonsterEvolutionName } from "../utils/monsterEvolution";

type RouteParams = {
  id?: string;
};

export default function MonsterDetail() {
  const route = useRoute();
  const navigation = useNavigation<any>();

  const {
    monsters,
    selectMonster,
    getCurrentMonsterCondition,
    getEffectiveMonsterStats,
  } = useGame();

  const params = (route.params || {}) as RouteParams;
  const monster = monsters.find((m) => m.id === params.id);

  if (!monster) {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>モンスターが見つかりません</Text>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← 戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getMonsterImage = () => {
    if (monster.level >= 100) return monsterAssetMap.FinalDarkVald;
    if (monster.level >= 75) return monsterAssetMap.ChaosVald;
    if (monster.level >= 50) return monsterAssetMap.NightVelos;
    if (monster.level >= 25) return monsterAssetMap.Shadowl;
    return monsterAssetMap.Darklet;
  };

  const conditionInfo = getCurrentMonsterCondition();
  const effectiveStats = getEffectiveMonsterStats(monster.id) || monster.stats;

  const isChanged =
    effectiveStats.hp !== monster.stats.hp ||
    effectiveStats.atk !== monster.stats.atk ||
    effectiveStats.def !== monster.stats.def ||
    effectiveStats.speed !== monster.stats.speed;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← 戻る</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          {getMonsterEvolutionName(monster.level)}
        </Text>

        <View style={{ width: 60 }} />
      </View>

      <View style={styles.card}>
        {conditionInfo.message && (
          <View style={styles.balloon}>
            <Text style={styles.balloonText}>{conditionInfo.message}</Text>
          </View>
        )}

        <Image source={getMonsterImage()} style={styles.image} resizeMode="contain" />

        <Text style={styles.stat}>Lv {monster.level} ・ XP {monster.xp}</Text>

        <Text style={styles.stat}>
          HP：{effectiveStats.hp}
          {isChanged ? `（元 ${monster.stats.hp}）` : ""}
        </Text>

        <Text style={styles.stat}>
          ATK：{effectiveStats.atk}
          {isChanged ? `（元 ${monster.stats.atk}）` : ""}
        </Text>

        <Text style={styles.stat}>
          DEF：{effectiveStats.def}
          {isChanged ? `（元 ${monster.stats.def}）` : ""}
        </Text>

        <Text style={styles.stat}>
          SPD：{effectiveStats.speed}
          {isChanged ? `（元 ${monster.stats.speed}）` : ""}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.selectBtn}
        onPress={() => {
          selectMonster(monster.id);
          navigation.goBack();
        }}
      >
        <Text style={styles.selectText}>このモンスターを代表にする</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    backgroundColor: "#071029",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    color: "#cbd5e1",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  card: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#0b1220",
    borderRadius: 12,
    alignItems: "center",
  },

  balloon: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },

  balloonText: {
    color: "#111827",
    fontWeight: "700",
  },

  image: {
    width: "100%",
    height: 420,
    backgroundColor: "transparent",
  },

  stat: {
    color: "#fff",
    marginVertical: 4,
  },

  selectBtn: {
    marginTop: 20,
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  selectText: {
    color: "#fff",
    fontWeight: "700",
  },

  backBtn: {
    marginTop: 12,
  },

  backText: {
    color: "#cbd5e1",
  },
});