export interface WeeklyItem {
  img: string;
  nome: string;
  valor: string;
  marketValue: string;
}

export interface LootItem {
  name: string;
  qty: number;
}

export interface MatchedItem extends WeeklyItem {
  qty: number;
  total: number;
}
