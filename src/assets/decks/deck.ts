import type { Deck } from "./deck-types";
import { hiraganaDeck } from "./hiragana";
import { jlptN5Deck } from "./jlptn5";
import { katakanaDeck } from "./katakana";

export const decks: Deck[] = [
  hiraganaDeck,
  katakanaDeck,
  jlptN5Deck,
]