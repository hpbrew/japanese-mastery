export interface Deck {
  id: string;
  name: string;
  cards: { front: string; back: string }[]
}
