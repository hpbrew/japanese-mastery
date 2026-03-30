import type { Deck } from "./deck-types";
import { hiraganaDeck } from "./hiragana";
import { jlptN5Deck } from "./jlptn5";
import { katakanaDeck } from "./katakana";
import { numberDeck } from "./N.4-N.5-Basic-1800/number";

export const decks: Deck[] = [
  hiraganaDeck,
  katakanaDeck,
  jlptN5Deck,
  numberDeck,
]