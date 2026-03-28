<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const decks = [
  { id: "hiragana", name: "Hiragana" },
  { id: "katakana", name: "Katakana" },
  { id: "jlpt-n5", name: "JLPT N5 - Basics" },
];

function open(deckId: string) {
  router.push({ name: "deck", params: { id: deckId } });
}
</script>

<template>
  <div class="deck-select">
    <h2>Select a deck</h2>
    <ul>
      <li v-for="deck in decks" :key="deck.id">
        <button class="deck-btn" @click="open(deck.id)">{{ deck.name }}</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.deck-select {
  text-align: center;
}
.deck-select h2 {
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
}
.deck-select ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 0.6rem;
  justify-content: center;
}
.deck-select li {
}
.deck-btn {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  cursor: pointer;
}
</style>
