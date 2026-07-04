// src/screens/GachaScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Animated, Modal } from "react-native";
import { useGame } from "../context/GameContext";
import { rollGacha } from "../utils/gacha";
import { useNavigation } from "@react-navigation/native";

let LottieView: any = null;
let lottieSource: any = null;
try {
  LottieView = require("lottie-react-native");
  const req: any = eval("require");
  lottieSource = req("../../assets/lottie/gacha_effect.json");
} catch (e) {
  LottieView = null;
  lottieSource = null;
}

const COST_SINGLE = 5;
const COST_TEN = 45;

export default function GachaScreen() {
  const { gachaStones, spendGachaStones, addMonster } = useGame();
  const navigation = useNavigation();
  const [results, setResults] = React.useState<any[]>([]);
  const anim = React.useRef(new Animated.Value(0)).current;
  const [showLottie, setShowLottie] = React.useState(false);

  const doGacha = (count: number) => {
    const cost = count === 1 ? COST_SINGLE : COST_TEN;
    if (!spendGachaStones(cost)) {
      alert("ガチャ石が足りません");
      return;
    }

    if (LottieView && lottieSource) {
      setShowLottie(true);
      setTimeout(() => setShowLottie(false), 1400);
    } else {
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }

    const r = rollGacha(count);
    r.forEach((m) => addMonster(m));
    setResults(r);
  };

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← ホームへ</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ガチャ</Text>
        <View style={{ width: 80 }} />
      </View>

      <Text style={styles.stones}>所持石: {gachaStones}</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.gachaBtn} onPress={() => doGacha(1)}>
          <Text style={styles.gachaText}>1回 ({COST_SINGLE}石)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gachaBtn} onPress={() => doGacha(10)}>
          <Text style={styles.gachaText}>10回 ({COST_TEN}石)</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={results}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.name} <Text style={styles.rarity}>({item.rarity})</Text>
            </Text>
          </View>
        )}
      />

      {LottieView && lottieSource ? (
        <Modal visible={showLottie} transparent>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" }}>
            <LottieView source={lottieSource} autoPlay loop={false} style={{ width: 300, height: 300 }} />
          </View>
        </Modal>
      ) : (
        <Animated.View style={[styles.effect, { opacity: anim }]} pointerEvents="none">
          <Text style={styles.effectText}>ガチャ！</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, backgroundColor: "#071029" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { padding: 8 },
  backText: { color: "#cbd5e1" },
  title: { color: "#fff", fontSize: 22, fontWeight: "700" },
  stones: { color: "#cbd5e1", marginVertical: 8 },
  row: { flexDirection: "row", justifyContent: "space-around", marginVertical: 12 },
  gachaBtn: { backgroundColor: "#ff7a7a", padding: 12, borderRadius: 12, minWidth: 140, alignItems: "center" },
  gachaText: { color: "#fff", fontWeight: "700" },
  card: { padding: 12, backgroundColor: "#0b1220", borderRadius: 10, marginVertical: 6 },
  name: { color: "#fff", fontWeight: "700" },
  rarity: { color: "#ffd166", fontWeight: "600" },
  effect: { position: "absolute", top: "40%", left: 0, right: 0, alignItems: "center" },
  effectText: { fontSize: 48, color: "#ffd166", fontWeight: "900", textShadowColor: "#ff7a7a", textShadowOffset: { width: 0, height: 6 }, textShadowRadius: 12 },
});
