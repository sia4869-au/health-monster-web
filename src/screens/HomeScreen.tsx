// src/screens/HomeScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { Monster } from "../components/Monster";
import { useGame } from "../context/GameContext";
import { useNavigation } from "@react-navigation/native";
import ActionModal from "../components/ActionModal";
import StatusBar from "../components/StatusBar";

const bg = require("../../assets/background.png"); // mobile/assets/background.png を配置してください

const HomeScreen: React.FC = () => {
  const { monsters, gachaStones } = useGame();
  const navigation = useNavigation<any>();
  const [modalType, setModalType] = React.useState<string | null>(null);

  const totalXP = monsters.reduce((s, m) => s + (m.xp || 0), 0);
  const totalLevel = monsters.reduce((s, m) => s + (m.level || 0), 0);

  return (
    <ImageBackground source={bg} style={{ flex: 1 }} resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Health Monster</Text>
          <View style={styles.hud}>
            <Text style={styles.hudText}>総XP {totalXP}</Text>
            <Text style={styles.hudText}>総Lv {totalLevel}</Text>
            <Text style={styles.hudText}>石 {gachaStones}</Text>
          </View>
        </View>

        <StatusBar />

        <Monster />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>総合レベル: {totalLevel}</Text>
          <Text style={styles.summaryText}>所持ガチャ石: {gachaStones}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.btn, styles.btnExercise]} onPress={() => setModalType("exercise")}>
            <Text style={styles.btnText}>運動</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnFood]} onPress={() => setModalType("food")}>
            <Text style={styles.btnText}>食事</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnMove]} onPress={() => setModalType("steps")}>
            <Text style={styles.btnText}>移動</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnSleep]} onPress={() => setModalType("sleep")}>
            <Text style={styles.btnText}>睡眠</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.extraRow}>
          <TouchableOpacity style={[styles.btn, styles.btnGacha]} onPress={() => navigation.navigate("Gacha" as never)}>
            <Text style={styles.btnText}>ガチャ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnMission]} onPress={() => navigation.navigate("Missions" as never)}>
            <Text style={styles.btnText}>ミッション</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnMonsters]} onPress={() => navigation.navigate("Monsters" as never)}>
            <Text style={styles.btnText}>仲間を見る</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnHistory]} onPress={() => navigation.navigate("History" as never)}>
           <Text style={styles.btnText}>履歴</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnQuest]} onPress={() => navigation.navigate("Quest" as never)}>
           <Text style={styles.btnText}>クエスト</Text>
          </TouchableOpacity>
        </View>

        <ActionModal type={modalType} onClose={() => setModalType(null)} />
      </View>
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  overlay: { flex: 1, padding: 16, backgroundColor: "rgba(0,0,0,0.25)" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: "#fff", fontSize: 22, fontWeight: "700" },
  hud: { flexDirection: "row", gap: 12 },
  hudText: { color: "#cbd5e1", marginLeft: 8 },
  summaryCard: { backgroundColor: "rgba(11,18,32,0.85)", padding: 12, borderRadius: 12, marginTop: 12 },
  summaryText: { color: "#e2e8f0" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 18 },
  extraRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  btn: { flex: 1, marginHorizontal: 4, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  btnExercise: { backgroundColor: "#ff7a7a" },
  btnFood: { backgroundColor: "#ffd166" },
  btnMove: { backgroundColor: "#7bd389" },
  btnSleep: { backgroundColor: "#7aa2ff" },
  btnGacha: { backgroundColor: "#a78bfa" },
  btnMission: { backgroundColor: "#60a5fa" },
  btnMonsters: { backgroundColor: "#f59e0b" },
  btnHistory: { backgroundColor: "#f97316" },
  btnQuest: { backgroundColor: "#ef4444" },    
});
