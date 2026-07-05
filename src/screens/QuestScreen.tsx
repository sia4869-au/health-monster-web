// src/screens/QuestScreen.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useGame } from "../context/GameContext";
import { useNavigation } from "@react-navigation/native";

export default function QuestScreen() {
  const {
    getAvailableQuests,
    runQuestBattle,
    dailyQuestCount,
    dailyQuestLimit,
  } = useGame();

  const navigation = useNavigation<any>();
  const quests = getAvailableQuests();

  const formatReward = (reward: any): string => {
    const rewards: string[] = [];

    if (reward?.exercisePoints) {
      rewards.push(`🏃 運動P ×${reward.exercisePoints}`);
    }

    if (reward?.foodPoints) {
      rewards.push(`🍖 食事P ×${reward.foodPoints}`);
    }

    if (reward?.stepsPoints) {
      rewards.push(`👣 移動P ×${reward.stepsPoints}`);
    }

    if (reward?.sleepPoints) {
      rewards.push(`😴 睡眠P ×${reward.sleepPoints}`);
    }

    if (reward?.stones) {
      rewards.push(`💎 ガチャ石 ×${reward.stones}`);
    }

    return rewards.length > 0 ? rewards.join(" / ") : "なし";
  };

  const onFight = (questId: string, enemyIndex: number) => {
    const res = runQuestBattle(questId, enemyIndex);

    if (res.limitReached) {
      Alert.alert(
        "本日の上限",
        res.message || "今日のクエスト上限に達しました。"
      );
      return;
    }

    if (res.success) {
      Alert.alert(
        "勝利！",
        `敵ドロップ：${formatReward(res.drops)}\nクエスト報酬：${formatReward(
          res.questReward
        )}`
      );
    } else {
      Alert.alert("敗北…", res.message || "モンスターは敗北しました。");
    }
  };

  const reachedLimit = dailyQuestCount >= dailyQuestLimit;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← ホームへ</Text>
        </TouchableOpacity>

        <Text style={styles.title}>クエスト</Text>

        <View style={{ width: 60 }} />
      </View>

      <View style={styles.limitCard}>
        <Text style={styles.limitText}>
          本日の挑戦回数：{dailyQuestCount} / {dailyQuestLimit}
        </Text>
      </View>

      <FlatList
        data={quests}
        keyExtractor={(q) => q.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.qTitle}>
              {item.title}（{item.difficulty}）
            </Text>

            <Text style={styles.qDesc}>
              クエスト報酬：{formatReward(item.reward)}
            </Text>

            <FlatList
              data={item.enemies}
              keyExtractor={(enemy) => enemy.id}
              renderItem={({ item: enemy, index }) => (
                <View style={styles.enemyRow}>
                  <View style={styles.enemyInfo}>
                    <Text style={styles.enemyName}>{enemy.name}</Text>
                    <Text style={styles.enemyStatus}>
                      HP:{enemy.hp} ATK:{enemy.atk} DEF:{enemy.def}
                    </Text>
                    <Text style={styles.enemyDrop}>
                      ドロップ：{formatReward(enemy.drop)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.fightBtn,
                      reachedLimit && styles.fightBtnDisabled,
                    ]}
                    onPress={() => onFight(item.id, index)}
                    disabled={reachedLimit}
                  >
                    <Text style={styles.fightText}>
                      {reachedLimit ? "上限" : "戦う"}
                    </Text>
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

  limitCard: {
    marginTop: 12,
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 10,
  },

  limitText: {
    color: "#facc15",
    fontWeight: "700",
    textAlign: "center",
  },

  card: {
    marginTop: 12,
    backgroundColor: "#0b1220",
    padding: 12,
    borderRadius: 8,
  },

  qTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  qDesc: {
    color: "#9ca3af",
    marginBottom: 8,
    marginTop: 4,
  },

  enemyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },

  enemyInfo: {
    flex: 1,
    marginRight: 8,
  },

  enemyName: {
    color: "#fff",
    fontWeight: "700",
  },

  enemyStatus: {
    color: "#cbd5e1",
    fontSize: 12,
    marginTop: 2,
  },

  enemyDrop: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 2,
  },

  fightBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  fightBtnDisabled: {
    backgroundColor: "#6b7280",
  },

  fightText: {
    color: "#fff",
    fontWeight: "700",
  },
});