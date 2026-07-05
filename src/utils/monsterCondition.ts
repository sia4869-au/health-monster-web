// src/utils/monsterCondition.ts
import { Stats, DailyGoals, MonsterStats } from "../context/GameContext";

export type MonsterCondition =
  | "sleepy"
  | "full"
  | "hungry"
  | "normal"
  | "good"
  | "excellent"
  | "awakened";

export type MonsterConditionInfo = {
  condition: MonsterCondition;
  message: string | null;
};

export const getMonsterCondition = (
  stats: Stats,
  elapsedDays: number,
  dailyGoals: DailyGoals
): MonsterConditionInfo => {
  const days = Math.max(elapsedDays, 1);

  const avgSleep = stats.sleepHours / days;
  const avgSteps = stats.steps / days;
  const avgBurned = stats.caloriesBurned / days;

  const avgSurplusCalories =
    (stats.caloriesConsumed - stats.caloriesBurned) / days;

  const avgDeficitCalories =
    (stats.caloriesBurned - stats.caloriesConsumed) / days;

  // 悪い状態を優先
  if (avgSleep < 6) {
    return {
      condition: "sleepy",
      message: "😪 眠いよ…",
    };
  }

  if (avgSurplusCalories > 7200) {
    return {
      condition: "full",
      message: "🤢 お腹いっぱい…",
    };
  }

  if (avgDeficitCalories > 1000) {
    return {
      condition: "hungry",
      message: "🍖 お腹減った…",
    };
  }

  // 良い状態
  if (
    avgSleep >= 8 &&
    avgSteps >= dailyGoals.steps &&
    avgBurned >= dailyGoals.caloriesBurned &&
    avgDeficitCalories >= 0 &&
    avgDeficitCalories <= 500
  ) {
    return {
      condition: "awakened",
      message: "🔥 覚醒状態！",
    };
  }

  if (
    avgSleep >= 7 &&
    avgSteps >= dailyGoals.steps &&
    Math.abs(avgSurplusCalories) <= 500
  ) {
    return {
      condition: "excellent",
      message: "💪 絶好調！",
    };
  }

  if (avgSleep >= 6.5 && Math.abs(avgSurplusCalories) <= 1000) {
    return {
      condition: "good",
      message: "😊 元気！",
    };
  }

  return {
    condition: "normal",
    message: null,
  };
};

export const getEffectiveStats = (
  baseStats: MonsterStats,
  condition: MonsterCondition
): MonsterStats => {
  let hp = baseStats.hp;
  let atk = baseStats.atk;
  let def = baseStats.def;
  let speed = baseStats.speed;

  if (condition === "sleepy") {
    hp *= 0.9;
    atk *= 0.85;
    speed *= 0.8;
  }

  if (condition === "full") {
    def *= 0.9;
    speed *= 0.8;
  }

  if (condition === "hungry") {
    hp *= 0.8;
    atk *= 0.9;
  }

  if (condition === "good") {
    hp *= 1.05;
    atk *= 1.05;
    def *= 1.05;
    speed *= 1.05;
  }

  if (condition === "excellent") {
    hp *= 1.1;
    atk *= 1.12;
    def *= 1.1;
    speed *= 1.15;
  }

  if (condition === "awakened") {
    hp *= 1.2;
    atk *= 1.25;
    def *= 1.2;
    speed *= 1.25;
  }

  return {
    hp: Math.round(hp),
    atk: Math.round(atk),
    def: Math.round(def),
    speed: Math.round(speed * 10) / 10,
  };
};