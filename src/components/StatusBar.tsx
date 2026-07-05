import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGame } from "../context/GameContext";

const StatusBar: React.FC = () => {
  const {
    stats,
    exercisePoints,
    foodPoints,
    stepsPoints,
    sleepPoints,
    dailyGoals,
  } = useGame();

  return (
    <View style={styles.container}>
      <View style={styles.col}>
        <Text style={styles.label}>消費</Text>
        <Text style={styles.value}>
          {Math.round(stats.caloriesBurned)} / {dailyGoals.caloriesBurned} kcal
        </Text>
      </View>

      <View style={styles.col}>
        <Text style={styles.label}>摂取</Text>
        <Text style={styles.value}>
          {Math.round(stats.caloriesConsumed)} / {dailyGoals.caloriesConsumed} kcal
        </Text>
      </View>

      <View style={styles.col}>
        <Text style={styles.label}>歩数</Text>
        <Text style={styles.value}>
          {stats.steps} / {dailyGoals.steps} 歩
        </Text>
      </View>

      <View style={styles.col}>
        <Text style={styles.label}>睡眠</Text>
        <Text style={styles.value}>
          {stats.sleepHours} / {dailyGoals.sleepHours} h
        </Text>
      </View>

      <View style={styles.pointsRow}>
        <Text style={styles.pointLabel}>
          運動P: <Text style={styles.pointValue}>{exercisePoints}</Text>
        </Text>
        <Text style={styles.pointLabel}>
          食事P: <Text style={styles.pointValue}>{foodPoints}</Text>
        </Text>
        <Text style={styles.pointLabel}>
          移動P: <Text style={styles.pointValue}>{stepsPoints}</Text>
        </Text>
        <Text style={styles.pointLabel}>
          睡眠P: <Text style={styles.pointValue}>{sleepPoints}</Text>
        </Text>
      </View>
    </View>
  );
};

export default StatusBar;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    marginTop: 8,
  },
  col: {
    marginBottom: 6,
  },
  label: {
    color: "#9ca3af",
    fontSize: 12,
  },
  value: {
    color: "#fff",
    fontWeight: "700",
  },
  pointsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  pointLabel: {
    color: "#cbd5e1",
    fontSize: 12,
  },
  pointValue: {
    color: "#ffd166",
    fontWeight: "700",
  },
});