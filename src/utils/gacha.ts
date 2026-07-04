// src/utils/gacha.ts
import { Monster } from "../context/GameContext";
import { v4 as uuidv4 } from "uuid";

type PoolItem = { name: string; rarity: "common" | "rare" | "epic" | "legend"; weight: number };

const POOL: PoolItem[] = [
  { name: "Puff", rarity: "common", weight: 60 },
  { name: "Sprout", rarity: "common", weight: 50 },
  { name: "Bolt", rarity: "rare", weight: 25 },
  { name: "Aqua", rarity: "rare", weight: 20 },
  { name: "Flare", rarity: "epic", weight: 8 },
  { name: "Aurora", rarity: "legend", weight: 2 },
];

function weightedPick(items: PoolItem[]): PoolItem {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const it of items) {
    if (r < it.weight) return it;
    r -= it.weight;
  }
  return items[0];
}

export function rollGacha(count: number = 1): Monster[] {
  const results: Monster[] = [];
  for (let i = 0; i < count; i++) {
    const pick = weightedPick(POOL);
    results.push({
      id: uuidv4(),
      name: pick.name,
      rarity: pick.rarity,
      level: 1,
      xp: 0,
      createdAt: Date.now(),
      stats: { hp: 50, atk: 8, def: 6, speed: 5 },
    });
  }
  return results;
}
