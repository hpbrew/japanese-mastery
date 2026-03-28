<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { hiraganaDeck } from "../assets/decks/hiragana";
import { jlptN5Deck } from "@/assets/decks/jlptn5";
import { katakanaDeck } from "@/assets/decks/katakana";

const route = useRoute();
const router = useRouter();
const deckId = computed(() => (route.params.id as string) || "unknown");

const decks: Record<string, { name: string; cards: Array<{ front: string; back: string }> }> = {
  hiragana: hiraganaDeck,
  katakana: katakanaDeck,
  "jlpt-n5": jlptN5Deck,
};

const deck = computed(() => decks[deckId.value] || { name: deckId.value, cards: [] });
const index = ref(0);
const showFrontFirst = ref(true);
const flipped = ref(!showFrontFirst.value);

watch(deckId, () => {
  index.value = 0;
  flipped.value = !showFrontFirst.value;
});

watch(showFrontFirst, () => {
  // when the viewing preference changes, reset current card side
  flipped.value = !showFrontFirst.value;
});

function next() {
  if (index.value < deck.value.cards.length - 1) {
    index.value++;
  } else {
    index.value = 0;
  }
  flipped.value = !showFrontFirst.value;
}

function prev() {
  if (index.value > 0) {
    index.value--;
  } else {
    index.value = Math.max(0, deck.value.cards.length - 1);
  }
  flipped.value = !showFrontFirst.value;
}

function flip() {
  // If front is showing, flip to reveal the back.
  // If back is showing, advance to the next card instead of flipping back.
  if (!flipped.value) {
    flipped.value = true;
    return;
  }

  // Back is showing — go to next card
  if (index.value < deck.value.cards.length - 1) {
    index.value++;
  } else {
    index.value = 0;
  }
  // reset side for the next card according to preference
  flipped.value = !showFrontFirst.value;
}

function goBack() {
  router.push({ name: "home" });
}

const current = computed(() => deck.value.cards[index.value] || { front: "", back: "" });
</script>

<template>
  <div class="deck-view">
    <header class="deck-header">
      <button class="back" @click="goBack">← Back</button>
      <h2>{{ deck.name }}</h2>
    </header>

    <div class="card-area">
      <div class="card" @click="flip">
        <div class="face front" v-if="!flipped">{{ current.front }}</div>
        <div class="face back" v-else>{{ current.back }}</div>
      </div>
    </div>

    <div class="controls">
      <label class="toggle">
        <input type="checkbox" v-model="showFrontFirst" />
        <span>Show front first</span>
      </label>
      <button @click="prev">Prev</button>
      <span>{{ index + 1 }} / {{ deck.cards.length }}</span>
      <button @click="next">Next</button>
    </div>
  </div>
</template>

<style scoped>
.deck-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.back {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
.card-area {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}
.card {
  width: 320px;
  height: 200px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
  cursor: pointer;
  user-select: none;
  background: var(--color-surface);
}
.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
}
.toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.toggle input[type="checkbox"] {
  width: 16px;
  height: 16px;
}
.face {
  padding: 1rem;
}
</style>
