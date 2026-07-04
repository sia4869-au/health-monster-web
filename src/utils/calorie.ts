// 簡易カロリー計算ユーティリティ
export const calcExerciseCalories = (met: number, weightKg: number, minutes: number) => {
  // MET × 体重(kg) × 時間(h)
  const hours = minutes / 60;
  return Math.round(met * weightKg * hours);
};

export const calcStepsCalories = (steps: number, stepLengthM = 0.7, weightKg = 60) => {
  // 距離 = steps × stepLengthM, 消費kcalの簡易換算 1kmあたり約1kcal/kg × weight
  const km = (steps * stepLengthM) / 1000;
  return Math.round(km * weightKg);
};
