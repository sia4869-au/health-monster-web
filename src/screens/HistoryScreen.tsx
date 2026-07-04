// src/screens/HistoryScreen.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useGame } from "../context/GameContext";
import { useNavigation } from "@react-navigation/native";

export default function HistoryScreen() {
  const { history } = useGame();
  const navigation = useNavigation<any>();

  const grouped = history.reduce<Record<string, any[]>>((acc, h) => {
    const d = h.timestamp.slice(0, 10);
    acc[d] = acc[d] || [];
    acc[d].push(h);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => (a < b ? -1 : 1)).reverse();

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>← ホームへ</Text></TouchableOpacity>
        <Text style={styles.title}>履歴</Text>
        <View style={{ width: 60 }} />
      </View>

      {dates.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyText}>履歴がありません。運動や食事を記録してください。</Text></View>
      ) : (
        <FlatList
          data={dates}
          keyExtractor={(d) => d}
          renderItem={({ item: date }) => (
            <View style={styles.dayBlock}>
              <Text style={styles.date}>{date}</Text>
              {grouped[date].map((h) => (
                <View key={h.id} style={styles.row}>
                  <Text style={styles.type}>{h.type}</Text>
                  <Text style={styles.desc}>{typeof h.payload === "object" ? JSON.stringify(h.payload) : String(h.payload)}</Text>
                  <Text style={styles.time}>{new Date(h.timestamp).toLocaleTimeString()}</Text>
                </View>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, backgroundColor: "#071029" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { color: "#cbd5e1" }, title: { color: "#fff", fontSize: 22, fontWeight: "700" },
  dayBlock: { marginTop: 12, backgroundColor: "#0b1220", padding: 10, borderRadius: 8 },
  date: { color: "#9ca3af", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  type: { color: "#fff", width: 80 },
  desc: { color: "#cbd5e1", flex: 1, marginLeft: 8 },
  time: { color: "#94a3b8", marginLeft: 8, width: 80, textAlign: "right" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" }, emptyText: { color: "#9ca3af" },
});
