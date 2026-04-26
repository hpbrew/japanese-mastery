<script setup lang="ts">
import { decks } from '@/assets/decks/deck';
import type { Deck } from '@/assets/decks/deck-types';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DeckAllCards from '@/components/deck/DeckAllCards.vue';

const route = useRoute();

const deckId = computed(() => {
  const id = route.params.id
  if(!id || typeof id !== 'string') {
    console.warn('No valid deck id provided in route params');
    return '';
  }

  return id;
});

const deck = computed(() => {
  const foundDeck = decks.find((deck) => deckId.value === deck.id);
  if (!foundDeck) {
    console.warn(`Deck with id ${deckId.value} not found`);
    const result: Deck =  { name: deckId.value, id: 'Unknown Deck', cards: [] };
    return result
  }
  return foundDeck;
});
</script>

<template>
<div class="deck-all-cards">
  <div>
    <h1>All cards for {{ deckId }}</h1>
    <DeckAllCards :deck="deck" />
  </div>
  <div>
    <h1>Error obtaining selected deck</h1>
  </div>
</div>
</template>