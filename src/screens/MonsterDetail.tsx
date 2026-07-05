// src/screens/MonsterDetail.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useGame } from "../context/GameContext";
import { useRoute, useNavigation } from "@react-navigation/native";
import { monsterAssetMap } from "../utils/monsterAssets";

type RouteParams = { id?: string };

export default function MonsterDetail() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { monsters, selectMonster } = useGame();
  const params = (route.params || {}) as RouteParams;
  const id = params.id;
  const monster = monsters.find((m) => m.id === id);

  if (!monster) {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>モンスターが見つかりません</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Text style={styles.backText}>← 戻る</Text></TouchableOpacity>
      </View>
    );
  }

  const getImage = () => {
    if (monster.level >= 100 && monsterAssetMap["FinalDarkVald"]) return monsterAssetMap["FinalDarkVald"];
    if (monster.level >= 75 && monsterAssetMap["ChaosVald"]) return monsterAssetMap["ChaosVald"];
    if (monster.level >= 50 && monsterAssetMap["NightVelos"]) return monsterAssetMap["NightVelos"];
    if (monster.level >= 25 && monsterAssetMap["Shadowl"]) return monsterAssetMap["Shadowl"];
    return monsterAssetMap.Darklet || require("../../assets/darklet.png");
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>← 戻る</Text></TouchableOpacity>
        <Text style={styles.title}>{monster.name}</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.card}>
        <Image source={getImage()} style={styles.image} />
        <Text style={styles.stat}>Lv {monster.level} • XP {monster.xp}</Text>
        <Text style={styles.stat}>HP: {monster.stats.hp}</Text>
        <Text style={styles.stat}>ATK: {monster.stats.atk}</Text>
        <Text style={styles.stat}>DEF: {monster.stats.def}</Text>
        <Text style={styles.stat}>SPD: {monster.stats.speed}</Text>
      </View>

      <TouchableOpacity style={styles.selectBtn} onPress={() => { selectMonster(monster.id); navigation.goBack(); }}>
        <Text style={styles.selectText}>このモンスターを代表にする</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, backgroundColor: "#071029" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { color: "#cbd5e1" }, title: { color: "#fff", fontSize: 22, fontWeight: "700" },
  card: { marginTop: 20, padding: 12, backgroundColor: "#0b1220", borderRadius: 10, alignItems: "center" },
  image: { width: 180, height: 180, marginBottom: 12 },
  stat: { color: "#fff", marginVertical: 4 },
  selectBtn: { marginTop: 20, backgroundColor: "#3b82f6", padding: 12, borderRadius: 10, alignItems: "center" },
  selectText: { color: "#fff", fontWeight: "700" },
  backBtn: { marginTop: 12 }, backText: { color: "#cbd5e1" },
});
