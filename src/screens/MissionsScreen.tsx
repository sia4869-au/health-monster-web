// src/screens/MissionsScreen.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useGame } from "../context/GameContext";
import { useNavigation } from "@react-navigation/native";

export default function MissionsScreen() {
  const { missions, claimMission } = useGame();
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← ホームへ</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ミッション</Text>
        <View style={{ width: 80 }} />
      </View>

      <FlatList
        data={missions}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => {
          const claimed = !!item.lastUpdated;
          return (
            <View style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text style={styles.name}>{item.title}</Text>
                  <Text style={styles.desc}>
                    {item.progress}/{item.target}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.reward}>報酬: {item.rewardStones} 石</Text>
                  <TouchableOpacity
                    style={[styles.claimBtn, item.completed && !claimed ? styles.claimBtnActive : styles.claimBtnDisabled]}
                    disabled={!item.completed || claimed}
                    onPress={() => claimMission(item.id)}
                  >
                    <Text style={styles.claimText}>{claimed ? "受取済み" : item.completed ? "受け取る" : "未達成"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, backgroundColor: "#071029" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { padding: 8 },
  backText: { color: "#cbd5e1" },
  title: { color: "#fff", fontSize: 22, fontWeight: "700" },
  card: { padding: 12, backgroundColor: "#0b1220", borderRadius: 10, marginVertical: 6 },
  name: { color: "#fff", fontWeight: "700" },
  desc: { color: "#cbd5e1" },
  reward: { color: "#ffd166", fontWeight: "700" },
  claimBtn: { marginTop: 8, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  claimBtnActive: { backgroundColor: "#7bd389" },
  claimBtnDisabled: { backgroundColor: "#374151" },
  claimText: { color: "#fff", fontWeight: "700" },
});
