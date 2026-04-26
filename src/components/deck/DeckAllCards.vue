<script lang="ts" setup>
import type { Deck } from '@/assets/decks/deck-types';
import { toRefs } from 'vue';
import DeckCard from './DeckCard.vue';
import router from '@/router';


const props = defineProps<{
  deck: Deck
}>()

const { deck } = toRefs(props)

function goBack() {
  router.push({ name: "deck", params: { id: deck.value.id } });
}
</script>

<template>
  <div class="deck-view-all-cards">
        <button class="back" @click="goBack">← Back</button>
    <h2>All Cards</h2>
    <div class="cards">
      <div v-for="(card, index) in deck.cards" :key="`${card.front}-${card.back}-${index}`" class="card">
        <DeckCard :current="card" :flipped="false" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.deck-view-all-cards {
  padding: 1rem;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
</style>