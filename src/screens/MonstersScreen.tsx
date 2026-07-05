// src/screens/MonstersScreen.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useGame, Monster as MonsterType } from "../context/GameContext";
import { useNavigation } from "@react-navigation/native";
import { monsterAssetMap } from "../utils/monsterAssets";

export default function MonstersScreen() {
  const { monsters, selectMonster, selectedMonsterId } = useGame();
  const navigation = useNavigation<any>();

 const primaryImageForItem = (item: MonsterType) => {
  if (item.level >= 100) return monsterAssetMap.FinalDarkVald;
  if (item.level >= 75) return monsterAssetMap.ChaosVald;
  if (item.level >= 50) return monsterAssetMap.NightVelos;
  if (item.level >= 25) return monsterAssetMap.Shadowl;

  return monsterAssetMap.Darklet;
};

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>← ホームへ</Text>
        </TouchableOpacity>

        <Text style={styles.title}>モンスター一覧</Text>

        <View style={{ width: 80 }} />
      </View>

      <FlatList
        data={monsters}
        keyExtractor={(monster) => monster.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={primaryImageForItem(item)}
              style={styles.thumb}
              resizeMode="contain"
            />

            <View style={styles.infoArea}>
              <Text style={styles.name}>{item.name}</Text>

              <Text style={styles.sub}>
                {item.rarity} ・ Lv {item.level} ・ XP {item.xp}
              </Text>

              <Text style={styles.created}>
                獲得日：
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.buttonArea}>
              <TouchableOpacity
                style={[
                  styles.selectBtn,
                  selectedMonsterId === item.id
                    ? styles.selectBtnActive
                    : undefined,
                ]}
                onPress={() => selectMonster(item.id)}
              >
                <Text style={styles.selectText}>
                  {selectedMonsterId === item.id ? "選択中" : "選択"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.detailBtn}
                onPress={() =>
                  navigation.navigate("MonsterDetail", {
                    id: item.id,
                  })
                }
              >
                <Text style={styles.detailText}>詳細</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              まだモンスターがいません。
              {"\n"}
              ガチャで仲間を増やしましょう。
            </Text>
          </View>
        }
        contentContainerStyle={
          monsters.length === 0
            ? { flex: 1, justifyContent: "center" }
            : undefined
        }
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

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  backBtn: {
    padding: 8,
  },

  backText: {
    color: "#cbd5e1",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#0b1220",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },

  thumb: {
    width: "100%",
    height: 240,
    borderRadius: 10,
    marginBottom: 10,
  },

  infoArea: {
    marginTop: 4,
  },

  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  sub: {
    color: "#9ca3af",
    marginTop: 6,
  },

  created: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 6,
  },

  buttonArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  selectBtn: {
    flex: 1,
    backgroundColor: "#374151",
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 6,
    alignItems: "center",
  },

  selectBtnActive: {
    backgroundColor: "#10b981",
  },

  selectText: {
    color: "#fff",
    fontWeight: "700",
  },

  detailBtn: {
    flex: 1,
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 6,
    alignItems: "center",
  },

  detailText: {
    color: "#fff",
    fontWeight: "700",
  },

  empty: {
    alignItems: "center",
    padding: 24,
  },

  emptyText: {
    color: "#9ca3af",
    textAlign: "center",
  },
});