import { LootItem, WeeklyItem, MatchedItem } from "./types";

export function parseLoot(text: string): LootItem[] {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => l.toLowerCase().includes("looted items"));

  if (start === -1) return [];

  const loot: LootItem[] = [];

  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const match = line.match(/(\d+)x\s(.+)/);
    if (match) {
      loot.push({
        qty: parseInt(match[1]),
        name: match[2].toLowerCase().trim(),
      });
    }
  }

  return loot;
}

export function findWeeklyMatches(
  lootItems: LootItem[],
  weeklyItems: WeeklyItem[]
): MatchedItem[] {
  const normalizedWeekly = weeklyItems.map((item) => ({
    ...item,
    normalized: item.nome.toLowerCase().trim(),
  }));

  const results: MatchedItem[] = [];

  for (const loot of lootItems) {
    const match = normalizedWeekly.find((w) => w.normalized === loot.name);

    if (match) {
      results.push({
        img: match.img,
        nome: match.nome,
        valor: match.valor,
        marketValue: match.marketValue,
        qty: loot.qty,
        total: loot.qty * parseInt(match.valor),
      });
    }
  }

  return results;
}
