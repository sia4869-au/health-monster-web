// src/utils/monsterEvolution.ts
export const getMonsterEvolutionName = (level: number) => {
  if (level >= 100) return "終焉のダークヴァルド";
  if (level >= 75) return "カオスヴァルド";
  if (level >= 50) return "ナイトヴェロス";
  if (level >= 25) return "シャドウル";
  return "ダークレット";
};