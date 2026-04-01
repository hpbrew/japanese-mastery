<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { decks } from "@/assets/decks/deck";
import DeckHeader from "@/components/deck/DeckHeader.vue";
import DeckCard from "@/components/deck/DeckCard.vue";
import DeckControls from "@/components/deck/DeckControls.vue";

const route = useRoute();
const router = useRouter();
const deckId = computed(() => (route.params.id as string) || "unknown");

const deck = computed(() => decks.find((deck)=>deckId.value === deck.id) || { name: deckId.value, cards: [] });
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



const current = computed(() => deck.value.cards[index.value] || { front: "", back: "" });
</script>

<template>
  <div class="deck-view">
    <DeckHeader :id="deckId" :name="deck.name" />

    <DeckCard :current="current" :flipped="flipped" @flip="flip" />

    <DeckControls
      :currentArrayIndex="index"
      :deckLength="deck.cards.length"
      @prev="prev"
      @flip="flip"
      @next="next"
    />
  </div>
</template>

<style scoped>

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

</style>
