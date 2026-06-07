<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { decks } from '@/assets/decks/deck';
import DeckHeader from '@/components/deck/DeckHeader.vue';
import DeckCard from '@/components/deck/DeckCard.vue';
import DeckControls from '@/components/deck/DeckControls.vue';
import { useSpeechRecognition } from '@/composables/useSpeechRecognition';
import { similarityScore } from '@/utils/speech-utils';

const route = useRoute();
const deckId = computed(() => (route.params.id as string) || 'unknown');

const deck = computed(() => decks.find((deck) => deckId.value === deck.id) || { name: deckId.value, cards: [] });
const index = ref(0);
const showFrontFirst = ref(true);
const flipped = ref(!showFrontFirst.value);
const voiceConfidence = ref<number | null>(null);
const transcript = ref('');
const speechError = ref('');
const speechThreshold = 0.75;

const { supported: speechSupported, recognizing, lastTranscript, start, stop } = useSpeechRecognition({
  lang: 'ja-JP',
  continuous: true,
  interimResults: false,
});

watch(deckId, () => {
  index.value = 0;
  flipped.value = !showFrontFirst.value;
  stop();
});

watch(showFrontFirst, () => {
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
  if (!flipped.value) {
    flipped.value = true;
    return;
  }

  if (index.value < deck.value.cards.length - 1) {
    index.value++;
  } else {
    index.value = 0;
  }
  flipped.value = !showFrontFirst.value;
}

const current = computed(() => deck.value.cards[index.value] || { front: '', back: '' });
const expectedAnswer = computed(() => (showFrontFirst.value ? current.value.back : current.value.front));

function handleSpeechResult(spokenText: string, isFinal: boolean, confidence: number) {
  transcript.value = spokenText;
  voiceConfidence.value = confidence;

  if (!isFinal) {
    return;
  }

  const score = similarityScore(spokenText, expectedAnswer.value);
  if (score >= speechThreshold) {
    next();
    transcript.value = '';
    voiceConfidence.value = null;
    speechError.value = '';
    return;
  }

  speechError.value = `Spoken answer did not match. (${Math.round(score * 100)}% similarity)`;
}

async function toggleSpeechRecognition() {
  if (!speechSupported) {
    speechError.value = 'Speech recognition is not supported in this browser.';
    return;
  }

  speechError.value = '';
  if (recognizing.value) {
    stop();
    return;
  }

  try {
    await start(handleSpeechResult);
  } catch (error: any) {
    speechError.value = error?.message || 'Unable to start speech recognition.';
  }
}

onBeforeUnmount(() => {
  stop();
});
</script>

<template>
  <div class="deck-view">
    <DeckHeader :id="deckId" :name="deck.name" />

    <DeckCard :current="current" :flipped="flipped" @flip="flip" />

    <section class="voice-controls">
      <button class="voice-button" @click="toggleSpeechRecognition">
        {{ recognizing ? 'Stop voice answer' : 'Start voice answer' }}
      </button>
      <div class="voice-status">
        <span v-if="!speechSupported">Speech recognition not supported in this browser.</span>
        <span v-else-if="recognizing">Listening... speak the answer.</span>
        <span v-else>Click to start voice answer listening.</span>
      </div>
      <div class="voice-feedback" v-if="transcript">
        <strong>Recognized:</strong> {{ transcript }}
        <span v-if="voiceConfidence !== null">({{ Math.round(voiceConfidence * 100) }}% confidence)</span>
      </div>
      <div class="voice-error" v-if="speechError">{{ speechError }}</div>
    </section>

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
.voice-controls {
  margin: 1.5rem 0;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  display: grid;
  gap: 0.75rem;
  background: var(--color-surface);
}
.voice-button {
  padding: 0.85rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-primary);
  color: var(--color-on-primary);
  cursor: pointer;
  font-weight: 600;
}
.voice-status,
.voice-feedback,
.voice-error {
  font-size: 0.95rem;
}
.voice-error {
  color: var(--color-danger, #b00020);
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
</style>
