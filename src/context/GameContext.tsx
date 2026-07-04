// src/context/GameContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

/* 型定義 */
export type MonsterStats = { hp: number; atk: number; def: number; speed: number; };

export type Monster = {
  id: string;
  name: string;
  rarity: "common" | "rare" | "epic" | "legend";
  level: number;
  xp: number;
  createdAt: number;
  stats: MonsterStats;
};

export type Mission = {
  id: string;
  type: "daily" | "weekly" | "permanent";
  title: string;
  target: number;
  progress: number;
  rewardStones: number;
  completed: boolean;
  lastUpdated?: string | null;
};

export type Stats = {
  xp: number;
  level: number;
  caloriesConsumed: number;
  caloriesBurned: number;
  sleepHours: number;
  steps: number;
};

export type HistoryItem = {
  id: string;
  type: "exercise" | "food" | "steps" | "sleep" | "quest";
  timestamp: string;
  payload: any;
  targetMonsterId?: string | null;
};

export type QuestEnemy = {
  id: string;
  name: string;
  hp: number;
  atk: number;
  def: number;
  drop: { exercisePoints?: number; foodPoints?: number; stepsPoints?: number; sleepPoints?: number; stones?: number };
};

export type Quest = {
  id: string;
  title: string;
  enemies: QuestEnemy[];
  reward: { exercisePoints?: number; foodPoints?: number; stepsPoints?: number; sleepPoints?: number; stones?: number };
  difficulty: "easy" | "normal" | "hard";
};

export type GameState = {
  monsters: Monster[];
  gachaStones: number;
  loginInfo: { lastLoginDate: string; consecutiveDays: number; totalLogins: number };
  missions: Mission[];
  stats: Stats;
  history: HistoryItem[];
  selectedMonsterId?: string | null;

  // ポイント
  exercisePoints: number;
  foodPoints: number;
  stepsPoints: number;
  sleepPoints: number;

  // クエスト
  quests: Quest[];

  // 操作
  addGachaStones: (n: number) => void;
  spendGachaStones: (n: number) => boolean;
  addMonster: (m: Partial<Monster>) => void;
  addActivityXP: (xp: number, targetMonsterId?: string | null) => void;
  addActivity: (type: string, payload: any, targetMonsterId?: string | null) => { ok: boolean; reason?: string };
  claimMission: (id: string) => void;
  selectMonster: (id: string) => void;
  save: () => Promise<void>;

  // ポイント操作
  addPoints: (kind: "exercise" | "food" | "steps" | "sleep", amount: number) => void;
  consumePoints: (kind: "exercise" | "food" | "steps" | "sleep", amount: number) => boolean;

  // クエスト操作
  getAvailableQuests: () => Quest[];
  runQuestBattle: (questId: string, enemyIndex: number, playerMonsterId?: string | null) => { success: boolean; drops?: any; message?: string };
};

const STORAGE_KEY = "game_state_v3";
const MAX_MONSTER_LEVEL = 100;

/* ヘルパー */
function defaultMonsterStats(): MonsterStats { return { hp: 50, atk: 8, def: 6, speed: 5 }; }
function createStarterMonster(): Monster {
  return { id: "starter-1", name: "Darklet", rarity: "common", level: 1, xp: 0, createdAt: Date.now(), stats: defaultMonsterStats() };
}
function createDefaultMissions(): Mission[] {
  return [
    { id: "daily_steps", type: "daily", title: "歩数を入力しよう", target: 2000, progress: 0, rewardStones: 1, completed: false, lastUpdated: null },
    { id: "weekly_login", type: "weekly", title: "週に3日ログイン", target: 3, progress: 0, rewardStones: 5, completed: false, lastUpdated: null },
    { id: "total_level_10", type: "permanent", title: "総合レベル合計10達成", target: 10, progress: 0, rewardStones: 10, completed: false, lastUpdated: null },
  ];
}

/* サンプルクエスト（簡易） */
const DEFAULT_QUESTS: Quest[] = [
  {
    id: "quest_1",
    title: "森の雑魚討伐",
    difficulty: "easy",
    enemies: [
      { id: "e1", name: "スライム", hp: 30, atk: 4, def: 1, drop: { exercisePoints: 5 } },
      { id: "e2", name: "コボルト", hp: 40, atk: 6, def: 2, drop: { foodPoints: 3 } },
    ],
    reward: { exercisePoints: 10, stones: 1 },
  },
  {
    id: "quest_2",
    title: "荒野の強敵",
    difficulty: "normal",
    enemies: [
      { id: "e3", name: "ゴブリン", hp: 80, atk: 10, def: 4, drop: { stepsPoints: 10 } },
      { id: "e4", name: "オーク", hp: 120, atk: 14, def: 6, drop: { exercisePoints: 15, stones: 1 } },
    ],
    reward: { exercisePoints: 20, foodPoints: 10, stones: 2 },
  },
];

const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [monsters, setMonsters] = useState<Monster[]>(() => [createStarterMonster()]);
  const [gachaStones, setGachaStones] = useState<number>(0);
  const [loginInfo, setLoginInfo] = useState<{ lastLoginDate: string; consecutiveDays: number; totalLogins: number }>({ lastLoginDate: "", consecutiveDays: 0, totalLogins: 0 });
  const [missions, setMissions] = useState<Mission[]>(createDefaultMissions());
  const [stats, setStats] = useState<Stats>({ xp: 0, level: 1, caloriesConsumed: 0, caloriesBurned: 0, sleepHours: 0, steps: 0 });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedMonsterId, setSelectedMonsterId] = useState<string | null>(null);

  // ポイント
  const [exercisePoints, setExercisePoints] = useState<number>(20);
  const [foodPoints, setFoodPoints] = useState<number>(20);
  const [stepsPoints, setStepsPoints] = useState<number>(20);
  const [sleepPoints, setSleepPoints] = useState<number>(20);

  // クエスト
  const [quests, setQuests] = useState<Quest[]>(DEFAULT_QUESTS);

  /* Load */
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.monsters)) {
            const migrated = parsed.monsters.map((m: any) => ({
              id: m.id || uuidv4(),
              name: m.name || "Unknown",
              rarity: m.rarity || "common",
              level: Math.min(m.level || 1, MAX_MONSTER_LEVEL),
              xp: m.xp || 0,
              createdAt: m.createdAt || Date.now(),
              stats: m.stats || defaultMonsterStats(),
            }));
            setMonsters(migrated);
          }
          if (typeof parsed.gachaStones === "number") setGachaStones(parsed.gachaStones);
          if (parsed.loginInfo) setLoginInfo(parsed.loginInfo);
          if (Array.isArray(parsed.missions)) setMissions(parsed.missions.map((mm:any)=>({ ...mm, lastUpdated: mm.lastUpdated || null })));
          if (parsed.stats) setStats(parsed.stats);
          if (Array.isArray(parsed.history)) setHistory(parsed.history);
          if (parsed.selectedMonsterId) setSelectedMonsterId(parsed.selectedMonsterId);

          // ポイントのロード（なければデフォルト）
          setExercisePoints(typeof parsed.exercisePoints === "number" ? parsed.exercisePoints : 20);
          setFoodPoints(typeof parsed.foodPoints === "number" ? parsed.foodPoints : 20);
          setStepsPoints(typeof parsed.stepsPoints === "number" ? parsed.stepsPoints : 20);
          setSleepPoints(typeof parsed.sleepPoints === "number" ? parsed.sleepPoints : 20);

          if (Array.isArray(parsed.quests)) setQuests(parsed.quests);
        } else {
          setMissions(createDefaultMissions());
          setSelectedMonsterId("starter-1");
        }
        await checkLoginReward();
      } catch (e) {
        console.warn("GameContext load failed", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Auto save */
  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        monsters,
        gachaStones,
        loginInfo,
        missions,
        stats,
        history,
        selectedMonsterId,
        exercisePoints,
        foodPoints,
        stepsPoints,
        sleepPoints,
        quests,
      })
    ).catch((e) => console.warn("GameContext save failed", e));
  }, [monsters, gachaStones, loginInfo, missions, stats, history, selectedMonsterId, exercisePoints, foodPoints, stepsPoints, sleepPoints, quests]);

  /* 基本操作 */
  const addGachaStones = (n: number) => setGachaStones((s) => s + n);
  const spendGachaStones = (n: number) => {
    if (gachaStones < n) return false;
    setGachaStones((s) => s - n);
    return true;
  };

  const addMonster = (m: Partial<Monster>) => {
    const id = m.id || uuidv4();
    const monster: Monster = {
      id,
      name: m.name || "Unknown",
      rarity: (m.rarity as any) || "common",
      level: Math.min(m.level || 1, MAX_MONSTER_LEVEL),
      xp: m.xp || 0,
      createdAt: m.createdAt || Date.now(),
      stats: m.stats || defaultMonsterStats(),
    };
    setMonsters((prev) => [...prev, monster]);
    setSelectedMonsterId(id);
  };

  /* レベルアップ適用（個体） */
  const applyLevelUpToMonster = (monster: Monster, gainedXp: number): Monster => {
    if (monster.level >= MAX_MONSTER_LEVEL) return monster;
    const newXp = monster.xp + gainedXp;
    const newLevel = Math.min(Math.floor(newXp / 100) + 1, MAX_MONSTER_LEVEL);
    const cappedXp = newLevel === MAX_MONSTER_LEVEL ? Math.min(newXp, MAX_MONSTER_LEVEL * 100) : newXp;
    let leveled = { ...monster, xp: cappedXp, level: newLevel };
    const levelDiff = newLevel - monster.level;
    if (levelDiff > 0) {
      leveled = {
        ...leveled,
        stats: {
          hp: leveled.stats.hp + levelDiff * 2,
          atk: leveled.stats.atk + levelDiff * 1,
          def: leveled.stats.def + levelDiff * 1,
          speed: Math.round((leveled.stats.speed + levelDiff * 0.5) * 10) / 10,
        },
      };
    }
    return leveled;
  };

  /* 履歴 */
  const pushHistory = (item: Omit<HistoryItem, "id" | "timestamp">) => {
    const h: HistoryItem = { id: uuidv4(), timestamp: new Date().toISOString(), ...item };
    setHistory((prev) => [h, ...prev].slice(0, 2000));
  };

  /* ポイント操作 */
  const addPoints = (kind: "exercise" | "food" | "steps" | "sleep", amount: number) => {
    if (amount <= 0) return;
    if (kind === "exercise") setExercisePoints((s) => s + amount);
    if (kind === "food") setFoodPoints((s) => s + amount);
    if (kind === "steps") setStepsPoints((s) => s + amount);
    if (kind === "sleep") setSleepPoints((s) => s + amount);
  };
  const consumePoints = (kind: "exercise" | "food" | "steps" | "sleep", amount: number) => {
    if (amount <= 0) return true;
    if (kind === "exercise") {
      if (exercisePoints < amount) return false;
      setExercisePoints((s) => s - amount);
      return true;
    }
    if (kind === "food") {
      if (foodPoints < amount) return false;
      setFoodPoints((s) => s - amount);
      return true;
    }
    if (kind === "steps") {
      if (stepsPoints < amount) return false;
      setStepsPoints((s) => s - amount);
      return true;
    }
    if (kind === "sleep") {
      if (sleepPoints < amount) return false;
      setSleepPoints((s) => s - amount);
      return true;
    }
    return false;
  };

  /* XP付与（個体） */
  const addActivityXP = (xp: number, targetMonsterId?: string | null) => {
    if (xp <= 0) return;
    setStats((s) => {
      const newXp = s.xp + xp;
      const newLevel = Math.floor(newXp / 100) + 1;
      return { ...s, xp: newXp, level: newLevel };
    });
    const targetId = targetMonsterId || selectedMonsterId || (monsters[0] && monsters[0].id) || null;
    if (!targetId) return;
    setMonsters((prev) => prev.map((m) => (m.id === targetId ? applyLevelUpToMonster(m, xp) : m)));
    updateMissionsProgress();
  };

  /* addActivity: ポイント消費ルールを適用して記録する */
  // 消費ポイントの計算ルール（例）
  // - 運動: 必要ポイント = Math.ceil(minutes / 5)  (5分ごとに1ポイント)
  // - 食事: 必要ポイント = Math.ceil(calories / 200) (200kcalごとに1ポイント)
  // - 歩数: 必要ポイント = Math.ceil(steps / 2000) (2000歩ごとに1ポイント)
  // - 睡眠: 必要ポイント = Math.ceil(hours / 2) (2時間ごとに1ポイント)
  const addActivity = (type: string, payload: any, targetMonsterId?: string | null) => {
    let xp = 0;
    let requiredPoints = 0;
    let kind: "exercise" | "food" | "steps" | "sleep" | null = null;

    if (type === "exercise") {
      const minutes = Number(payload.minutes || 0);
      const calories = Number(payload.calories || 0);
      // XP は分数に依存（2xp/分）
      xp = Math.round(minutes * 2);
      // 必要ポイント（5分ごとに1）
      requiredPoints = Math.ceil(minutes / 5);
      kind = "exercise";
      // 先にポイントチェック
      if (!consumePoints(kind, requiredPoints)) return { ok: false, reason: "運動ポイントが足りません" };
      setStats((s) => ({ ...s, caloriesBurned: s.caloriesBurned + calories }));
      pushHistory({ type: "exercise", payload: { minutes, category: payload.category, calories }, targetMonsterId });
    } else if (type === "food") {
      const calories = Number(payload.calories || 500);
      xp = Math.round((payload.quality || 1) * 1);
      requiredPoints = Math.ceil(calories / 200);
      kind = "food";
      if (!consumePoints(kind, requiredPoints)) return { ok: false, reason: "食事ポイントが足りません" };
      setStats((s) => ({ ...s, caloriesConsumed: s.caloriesConsumed + calories }));
      pushHistory({ type: "food", payload: { item: payload.item || "Custom", calories }, targetMonsterId });
    } else if (type === "sleep") {
      const hours = Number(payload.hours || 0);
      xp = Math.round(hours * 3);
      requiredPoints = Math.ceil(hours / 2);
      kind = "sleep";
      if (!consumePoints(kind, requiredPoints)) return { ok: false, reason: "睡眠ポイントが足りません" };
      setStats((s) => ({ ...s, sleepHours: s.sleepHours + hours }));
      pushHistory({ type: "sleep", payload: { hours }, targetMonsterId });
    } else if (type === "steps") {
      const steps = Number(payload.steps || 0);
      const calories = Number(payload.calories || Math.round((steps * 0.7) / 1000 * 60));
      xp = Math.round(steps / 1000);
      requiredPoints = Math.ceil(steps / 2000);
      kind = "steps";
      if (!consumePoints(kind, requiredPoints)) return { ok: false, reason: "移動ポイントが足りません" };
      setStats((s) => ({ ...s, steps: s.steps + steps, caloriesBurned: s.caloriesBurned + calories }));
      pushHistory({ type: "steps", payload: { steps, calories }, targetMonsterId });
      // 歩数ミッション更新
      setMissions((prev) =>
        prev.map((m) => {
          if (m.id === "daily_steps") {
            const newProgress = (m.progress || 0) + steps;
            const completed = newProgress >= m.target;
            return { ...m, progress: newProgress, completed };
          }
          return m;
        })
      );
    } else {
      return { ok: false, reason: "Unknown activity" };
    }

    // XP を付与（個体）
    if (xp > 0) addActivityXP(xp, targetMonsterId);

    return { ok: true };
  };

  /* ミッション受取（チェーンは既存ロジック） */
  const claimMission = (id: string) => {
    setMissions((prev) => {
      const next = prev.map((m) => {
        if (m.id === id) {
          const claimed = !!m.lastUpdated;
          if (m.completed && !claimed) {
            const today = new Date().toISOString();
            addGachaStones(m.rewardStones);
            return { ...m, lastUpdated: today };
          }
        }
        return m;
      });

      // チェーン生成（歩数/ログイン）
      const orig = prev.find((x) => x.id === id);
      const toAppend: Mission[] = [];
      if (orig?.id === "daily_steps") {
        if (!prev.some((x) => x.id === "daily_steps_4000")) {
          toAppend.push({ id: "daily_steps_4000", type: "daily", title: "歩数を入力しよう（4000）", target: 4000, progress: 0, rewardStones: 2, completed: false, lastUpdated: null });
        }
      }
      if (orig?.id === "weekly_login") {
        if (!prev.some((x) => x.id === "weekly_login_5")) {
          toAppend.push({ id: "weekly_login_5", type: "weekly", title: "週に5日ログイン", target: 5, progress: 0, rewardStones: 8, completed: false, lastUpdated: null });
        }
      }

      return [...next, ...toAppend];
    });
  };

  const updateMissionsProgress = () => {
    const totalLevel = monsters.reduce((s, m) => s + (m.level || 0), 0);
    setMissions((prev) =>
      prev.map((m) => {
        if (m.type === "permanent" && m.id.startsWith("total_level")) {
          const completed = totalLevel >= m.target;
          return { ...m, progress: totalLevel, completed };
        }
        return m;
      })
    );
  };

  /* ログイン報酬 */
  const checkLoginReward = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      if (loginInfo.lastLoginDate === today) return;
      const last = loginInfo.lastLoginDate;
      let consecutive = 1;
      if (last) {
        const lastDate = new Date(last);
        const diff = Math.round((new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) consecutive = loginInfo.consecutiveDays + 1;
      }
      const totalLogins = loginInfo.totalLogins + 1;
      setLoginInfo({ lastLoginDate: today, consecutiveDays: consecutive, totalLogins });
      const bonus = consecutive % 7 === 0 ? 5 : 0;
      addGachaStones(1 + bonus);
      setMissions((prev) => prev.map((m) => (m.type === "weekly" ? { ...m, progress: (m.progress || 0) + 1 } : m)));
    } catch (e) {
      console.warn("checkLoginReward failed", e);
    }
  };

  const selectMonster = (id: string) => setSelectedMonsterId(id);
  const save = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ monsters, gachaStones, loginInfo, missions, stats, history, selectedMonsterId, exercisePoints, foodPoints, stepsPoints, sleepPoints, quests }));
  };

  /* クエスト関連 */
  const getAvailableQuests = () => quests;

  // 簡易バトル: プレイヤーは選択モンスター（または指定）を使う。ターン制で交互に攻撃。
  // 戦闘は deterministic で短時間で終わるようにする。敗北時は報酬なし。
  const runQuestBattle = (questId: string, enemyIndex: number, playerMonsterId?: string | null) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return { success: false, message: "クエストが見つかりません" };
    const enemy = quest.enemies[enemyIndex];
    if (!enemy) return { success: false, message: "敵が見つかりません" };

    const playerId = playerMonsterId || selectedMonsterId || (monsters[0] && monsters[0].id) || null;
    if (!playerId) return { success: false, message: "使用するモンスターがいません" };
    const player = monsters.find((m) => m.id === playerId);
    if (!player) return { success: false, message: "モンスターが見つかりません" };

    // コピーして戦闘用に使う
    let enemyHp = enemy.hp;
    let playerHp = player.stats.hp + player.level * 2; // 簡易: レベルでHP補正
    const playerAtk = Math.max(1, player.stats.atk + Math.floor(player.level / 5));
    const playerDef = Math.max(0, player.stats.def);
    const enemyAtk = enemy.atk;
    const enemyDef = enemy.def;

    // ターン制: プレイヤー先行
    let turn = 0;
    while (enemyHp > 0 && playerHp > 0 && turn < 100) {
      // プレイヤー攻撃
      const dmgToEnemy = Math.max(1, playerAtk - enemyDef);
      enemyHp -= dmgToEnemy;
      if (enemyHp <= 0) break;
      // 敵攻撃
      const dmgToPlayer = Math.max(1, enemyAtk - playerDef);
      playerHp -= dmgToPlayer;
      turn++;
    }

    if (enemyHp <= 0) {
      // ドロップ付与
      const drops = enemy.drop || {};
      if (drops.exercisePoints) addPoints("exercise", drops.exercisePoints);
      if (drops.foodPoints) addPoints("food", drops.foodPoints);
      if (drops.stepsPoints) addPoints("steps", drops.stepsPoints);
      if (drops.sleepPoints) addPoints("sleep", drops.sleepPoints);
      if (drops.stones) addGachaStones(drops.stones);

      // クエストクリア報酬（全体報酬は quest.reward）
      if (quest.reward) {
        if (quest.reward.exercisePoints) addPoints("exercise", quest.reward.exercisePoints);
        if (quest.reward.foodPoints) addPoints("food", quest.reward.foodPoints);
        if (quest.reward.stepsPoints) addPoints("steps", quest.reward.stepsPoints);
        if (quest.reward.sleepPoints) addPoints("sleep", quest.reward.sleepPoints);
        if (quest.reward.stones) addGachaStones(quest.reward.stones);
      }

      // 履歴に残す
      pushHistory({ type: "quest", payload: { questId: quest.id, enemyId: enemy.id, result: "win", drops: { ...drops, reward: quest.reward } } });

      return { success: true, drops: { ...drops, reward: quest.reward }, message: "勝利しました" };
    } else {
      // 敗北
      pushHistory({ type: "quest", payload: { questId: quest.id, enemyId: enemy.id, result: "lose" } });
      return { success: false, message: "敗北しました" };
    }
  };

  return (
    <GameContext.Provider
      value={{
        monsters,
        gachaStones,
        loginInfo,
        missions,
        stats,
        history,
        selectedMonsterId,
        exercisePoints,
        foodPoints,
        stepsPoints,
        sleepPoints,
        quests,
        addGachaStones,
        spendGachaStones,
        addMonster,
        addActivityXP,
        addActivity,
        claimMission,
        selectMonster,
        save,
        addPoints,
        consumePoints,
        getAvailableQuests,
        runQuestBattle,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameState => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
};
