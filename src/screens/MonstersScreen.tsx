// src/screens/MonstersScreen.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useGame, Monster as MonsterType } from "../context/GameContext";
import { useNavigation } from "@react-navigation/native";
import { monsterAssetMap } from "../utils/monsterAssets";

export default function MonstersScreen() {
  const { monsters, selectMonster, selectedMonsterId } = useGame();
  const navigation = useNavigation<any>();

  const primaryImageForItem = (item: MonsterType) => {
    if (item.level >= 100 && monsterAssetMap["FinalDarkVald"]) return monsterAssetMap["FinalDarkVald"];
    if (item.level >= 75 && monsterAssetMap["ChaosVald"]) return monsterAssetMap["ChaosVald"];
    if (item.level >= 50 && monsterAssetMap["NightVelos"]) return monsterAssetMap["NightVelos"];
    if (item.level >= 25 && monsterAssetMap["Shadowl"]) return monsterAssetMap["Shadowl"];
    if (monsterAssetMap[item.name]) return monsterAssetMap[item.name];
    try { return require("../../assets/monster_stage1.png"); } catch { return undefined; }
  };

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Text style={styles.backText}>← ホームへ</Text></TouchableOpacity>
        <Text style={styles.title}>モンスター一覧</Text>
        <View style={{ width: 80 }} />
      </View>

      <FlatList
        data={monsters}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              {primaryImageForItem(item) ? <Image source={primaryImageForItem(item)} style={styles.thumb} /> : <View style={[styles.thumb, styles.thumbPlaceholder]}><Text style={styles.placeholderText}>No Image</Text></View>}
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.sub}>{item.rarity} • Lv {item.level} • XP {item.xp}</Text>
              </View>
              <View style={{ alignItems: "flex-end", marginRight: 8 }}>
                <Text style={styles.created}>獲得: {new Date(item.createdAt).toLocaleDateString()}</Text>
                <TouchableOpacity style={[styles.selectBtn, selectedMonsterId === item.id ? styles.selectBtnActive : undefined]} onPress={() => selectMonster(item.id)}>
                  <Text style={styles.selectText}>{selectedMonsterId === item.id ? "選択中" : "選択"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.detailBtn} onPress={() => navigation.navigate("MonsterDetail", { id: item.id })}>
                  <Text style={styles.detailText}>詳細</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>まだモンスターがいません。ガチャで仲間を増やしましょう。</Text></View>}
        contentContainerStyle={monsters.length === 0 ? { flex: 1, justifyContent: "center" } : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, backgroundColor: "#071029" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { padding: 8 }, backText: { color: "#cbd5e1" }, title: { color: "#fff", fontSize: 22, fontWeight: "700" },
  card: { padding: 12, backgroundColor: "#0b1220", borderRadius: 10, marginVertical: 6 },
  thumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: "#111827" },
  thumbPlaceholder: { justifyContent: "center", alignItems: "center" }, placeholderText: { color: "#6b7280", fontSize: 12 },
  name: { color: "#fff", fontWeight: "700" }, sub: { color: "#9ca3af", marginTop: 4 }, created: { color: "#94a3b8", fontSize: 12, marginBottom: 6 },
  selectBtn: { backgroundColor: "#374151", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, marginTop: 6 },
  selectBtnActive: { backgroundColor: "#10b981" }, selectText: { color: "#fff", fontWeight: "700" },
  detailBtn: { marginTop: 6, backgroundColor: "#3b82f6", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 }, detailText: { color: "#fff", fontWeight: "700" },
  empty: { alignItems: "center", padding: 24 }, emptyText: { color: "#9ca3af" },
});
