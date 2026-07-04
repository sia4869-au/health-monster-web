// src/screens/HistoryScreen.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useGame } from "../context/GameContext";
import { useNavigation } from "@react-navigation/native";

export default function HistoryScreen() {
  const { history } = useGame();
  const navigation = useNavigation<any>();

  const formatType = (type: string) => {
    switch (type) {
      case "exercise":
        return "🏃 運動";
      case "food":
        return "🍖 食事";
      case "steps":
        return "👣 歩数";
      case "sleep":
        return "😴 睡眠";
      case "quest":
        return "⚔️ クエスト";
      default:
        return type;
    }
  };

  const formatPayload = (h: any) => {
    const p = h.payload;

    switch (h.type) {
      case "exercise":
        return `${p.minutes}分運動 (${p.calories}kcal消費)`;

      case "food":
        return `${p.item} を摂取 (${p.calories}kcal)`;

      case "steps":
        return `${p.steps.toLocaleString()}歩 歩いた (${p.calories}kcal消費)`;

      case "sleep":
        return `${p.hours}時間睡眠`;

      case "quest":
        return p.result === "win"
        ? "クエストに勝利"
        : "クエストに敗北";

      default:
        return JSON.stringify(p);
    }
  };

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
                  <Text style={styles.type}>
                    {formatType(h.type)}
                  </Text>
                  <Text style={styles.desc}>
                    {formatPayload(h)}
                  </Text>
                  <Text style={styles.time}>{new Date(h.timestamp).toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                    })}
                  </Text>
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
