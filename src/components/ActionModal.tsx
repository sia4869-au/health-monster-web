// src/components/ActionModal.tsx
import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useGame } from "../context/GameContext";

const EXERCISE_RATES: Record<string, number> = {
  Running: 10,
  Jogging: 8,
  Soccer: 9,
  Basketball: 9,
  Baseball: 6,
  Walking: 4,
  Cycling: 7,
};

const FOOD_CALORIES: Record<string, number> = {
  Ramen: 800,
  Gyudon: 700,
  Banana: 100,
  Salad: 150,
  Sushi: 400,
  Curry: 900,
  Sandwich: 450,
};

type Props = { type: string | null; onClose: () => void; };

const ActionModal: React.FC<Props> = ({ type, onClose }) => {
  const { addActivity, monsters, selectedMonsterId, exercisePoints, foodPoints, stepsPoints, sleepPoints } = useGame();
  const [value, setValue] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedFood, setSelectedFood] = React.useState<string | null>(null);
  const [targetMonster, setTargetMonster] = React.useState<string | null>(selectedMonsterId || (monsters[0] && monsters[0].id) || null);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setValue("");
    setSelectedCategory(null);
    setSelectedFood(null);
    setTargetMonster(selectedMonsterId || (monsters[0] && monsters[0].id) || null);
    setMessage(null);
  }, [type, selectedMonsterId, monsters]);

  const calcRequiredPoints = () => {
    if (!type) return 0;
    if (type === "exercise") {
      const minutes = Number(value || 0);
      return Math.ceil(minutes / 5);
    }
    if (type === "food") {
      const calories = selectedFood ? (FOOD_CALORIES[selectedFood] || 0) : Number(value || 0);
      return Math.ceil(calories / 200);
    }
    if (type === "steps") {
      const steps = Number(value || 0);
      return Math.ceil(steps / 2000);
    }
    if (type === "sleep") {
      const hours = Number(value || 0);
      return Math.ceil(hours / 2);
    }
    return 0;
  };

  const getOwnedPoints = () => {
    if (!type) return 0;
    if (type === "exercise") return exercisePoints;
    if (type === "food") return foodPoints;
    if (type === "steps") return stepsPoints;
    if (type === "sleep") return sleepPoints;
    return 0;
  };

  const submit = () => {
    if (!type) return onClose();
    setMessage(null);
    const required = calcRequiredPoints();
    const owned = getOwnedPoints();
    if (required > owned) {
      setMessage(`必要ポイント: ${required}、所持ポイント: ${owned}。ポイントが足りません`);
      return;
    }

    if (type === "exercise") {
      const minutes = Number(value || 30);
      const category = selectedCategory || "Walking";
      const rate = EXERCISE_RATES[category] || 6;
      const calories = Math.round(rate * minutes);
      const res = addActivity("exercise", { minutes, category, calories }, targetMonster);
      if (!res.ok) setMessage(res.reason || "保存に失敗しました");
      else onClose();
    } else if (type === "food") {
      const calories = selectedFood ? (FOOD_CALORIES[selectedFood] || 0) : Number(value || 500);
      const res = addActivity("food", { item: selectedFood || "Custom", calories }, targetMonster);
      if (!res.ok) setMessage(res.reason || "保存に失敗しました");
      else onClose();
    } else if (type === "steps") {
      const steps = Number(value || 1000);
      const calories = Math.round((steps * 0.7) / 1000 * 60);
      const res = addActivity("steps", { steps, calories }, targetMonster);
      if (!res.ok) setMessage(res.reason || "保存に失敗しました");
      else onClose();
    } else if (type === "sleep") {
      const hours = Number(value || 7);
      const res = addActivity("sleep", { hours }, targetMonster);
      if (!res.ok) setMessage(res.reason || "保存に失敗しました");
      else onClose();
    }
  };

  if (!type) return null;

  return (
    <Modal visible={!!type} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{type === "exercise" ? "運動を記録" : type === "food" ? "食事を記録" : type === "steps" ? "歩数を記録" : "睡眠を記録"}</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
            {monsters.map((m) => (
              <TouchableOpacity key={m.id} style={[styles.monBtn, targetMonster === m.id ? styles.monBtnActive : undefined]} onPress={() => setTargetMonster(m.id)}>
                <Text style={styles.monBtnText}>{m.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.monBtn, targetMonster === null ? styles.monBtnActive : undefined]} onPress={() => setTargetMonster(null)}>
              <Text style={styles.monBtnText}>全体</Text>
            </TouchableOpacity>
          </ScrollView>

          {type === "exercise" && (
            <>
              <Text style={styles.label}>カテゴリ</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                {Object.keys(EXERCISE_RATES).map((k) => (
                  <TouchableOpacity key={k} style={[styles.catBtn, selectedCategory === k ? styles.catBtnActive : undefined]} onPress={() => setSelectedCategory(k)}>
                    <Text style={styles.catText}>{k}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TextInput style={styles.input} value={value} onChangeText={setValue} keyboardType="numeric" placeholder="分数を入力 (例: 30)" placeholderTextColor="#6b7280" />
            </>
          )}

          {type === "food" && (
            <>
              <Text style={styles.label}>メニュー</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                {Object.keys(FOOD_CALORIES).map((k) => (
                  <TouchableOpacity key={k} style={[styles.catBtn, selectedFood === k ? styles.catBtnActive : undefined]} onPress={() => setSelectedFood(k)}>
                    <Text style={styles.catText}>{k}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity key="custom" style={[styles.catBtn, selectedFood === null ? styles.catBtnActive : undefined]} onPress={() => setSelectedFood(null)}>
                  <Text style={styles.catText}>手入力</Text>
                </TouchableOpacity>
              </ScrollView>
              <TextInput style={styles.input} value={value} onChangeText={setValue} keyboardType="numeric" placeholder="摂取カロリーを入力 (例: 500)" placeholderTextColor="#6b7280" />
            </>
          )}

          {type === "steps" && <TextInput style={styles.input} value={value} onChangeText={setValue} keyboardType="numeric" placeholder="歩数を入力 (例: 1200)" placeholderTextColor="#6b7280" />}

          {type === "sleep" && <TextInput style={styles.input} value={value} onChangeText={setValue} keyboardType="numeric" placeholder="睡眠時間 (時間) 例: 7" placeholderTextColor="#6b7280" />}

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
            <Text style={{ color: "#9ca3af" }}>必要ポイント: {calcRequiredPoints()}</Text>
            <Text style={{ color: "#9ca3af" }}>所持: {getOwnedPoints()}</Text>
          </View>

          {message && <Text style={{ color: "#ffb4b4", marginTop: 8 }}>{message}</Text>}

          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={onClose}><Text style={styles.btnText}>キャンセル</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.save]} onPress={submit}><Text style={styles.btnText}>保存</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ActionModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  card: { width: "92%", backgroundColor: "#0b1220", padding: 16, borderRadius: 12 },
  title: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 12 },
  label: { color: "#9ca3af", marginBottom: 6 },
  input: { backgroundColor: "#071029", color: "#fff", padding: 12, borderRadius: 8, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  btn: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center", marginHorizontal: 6 },
  cancel: { backgroundColor: "#374151" },
  save: { backgroundColor: "#10b981" },
  btnText: { color: "#fff", fontWeight: "700" },
  catBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#1f2937", borderRadius: 8, marginRight: 8 },
  catBtnActive: { backgroundColor: "#2563eb" },
  catText: { color: "#fff", fontWeight: "700" },
  monBtn: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: "#111827", borderRadius: 8, marginRight: 8 },
  monBtnActive: { backgroundColor: "#10b981" },
  monBtnText: { color: "#fff" },
});
