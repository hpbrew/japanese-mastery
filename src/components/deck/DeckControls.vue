<script lang="ts" setup>
import { computed, toRefs } from 'vue';

const emit = defineEmits<{
  prev: [],
  flip: [],
  next: [],
}>()

const props = defineProps<{
  currentArrayIndex: number,
  deckLength: number
}>()

const { currentArrayIndex, deckLength } = toRefs(props)

const displayIndex = computed(() => currentArrayIndex.value + 1);  

</script>

<template>
  <div class="deck-controls-content">
    <span>{{ displayIndex }} / {{ deckLength }}</span>
    <div class="deck-controls">
      <button @click="emit('prev')">← Previous</button>
      <button @click="emit('flip')">Flip</button>
      <button @click="emit('next')">Next →</button>
    </div>
  </div>
</template>

<style scoped>
.deck-controls-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}
.deck-controls {
  display: flex;
  gap: 0.6rem;
  justify-content: center;
}
.deck-controls button {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  cursor: pointer;
}
</style>