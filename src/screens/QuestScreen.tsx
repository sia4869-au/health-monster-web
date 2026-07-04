// src/screens/QuestScreen.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useGame } from "../context/GameContext";
import { useNavigation } from "@react-navigation/native";

export default function QuestScreen() {
  const { getAvailableQuests, runQuestBattle } = useGame();
  const navigation = useNavigation<any>();
  const quests = getAvailableQuests();

   // ←ここに追加
  const formatReward = (reward: any) => {
    const rewards = [];

    if (reward.exercisePoints)
      rewards.push(`🏃 運動ポイント ×${reward.exercisePoints}`);

    if (reward.foodPoints)
      rewards.push(`🍖 食事ポイント ×${reward.foodPoints}`);

    if (reward.stepsPoints)
      rewards.push(`👣 移動ポイント ×${reward.stepsPoints}`);

    if (reward.sleepPoints)
      rewards.push(`😴 睡眠ポイント ×${reward.sleepPoints}`);

    if (reward.stones)
      rewards.push(`💎 ガチャ石 ×${reward.stones}`);

    return rewards.join(" / ");
  };
  const onFight = (questId: string, enemyIndex: number) => {
    const res = runQuestBattle(questId, enemyIndex);
    if (res.success) {
      Alert.alert("勝利", `ドロップ: ${formatReward(res.drops)}`);
    } else {
      Alert.alert("敗北", res.message || "敗北しました");
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>← ホームへ</Text></TouchableOpacity>
        <Text style={styles.title}>クエスト</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={quests}
        keyExtractor={(q) => q.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.qTitle}>{item.title} ({item.difficulty})</Text>
            <Text style={styles.qDesc}>報酬: {formatReward(item.reward)}</Text>
            <FlatList
              data={item.enemies}
              keyExtractor={(e) => e.id}
              renderItem={({ item: e, index }) => (
                <View style={styles.enemyRow}>
                  <Text style={styles.enemyName}>{e.name} Lv? HP:{e.hp} ATK:{e.atk} DEF:{e.def}</Text>
                  <TouchableOpacity style={styles.fightBtn} onPress={() => onFight(item.id, index)}>
                    <Text style={styles.fightText}>戦う</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, backgroundColor: "#071029" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { color: "#cbd5e1" }, title: { color: "#fff", fontSize: 22, fontWeight: "700" },
  card: { marginTop: 12, backgroundColor: "#0b1220", padding: 12, borderRadius: 8 },
  qTitle: { color: "#fff", fontWeight: "700" },
  qDesc: { color: "#9ca3af", marginBottom: 8 },
  enemyRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 6 },
  enemyName: { color: "#fff" },
  fightBtn: { backgroundColor: "#ef4444", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  fightText: { color: "#fff", fontWeight: "700" },
});
