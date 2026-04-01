<script setup lang="ts">
import { toRefs } from 'vue';

const emit = defineEmits<{
  flip: [],
}>();

const props = defineProps<{
  current: {
    front: string,
    back: string,
  },
  flipped: boolean,
}>();

const { current, flipped } = toRefs(props);

function flip(){
  emit("flip");
}

</script>

<template>
      <div class="card-area">
      <div class="card" @click="flip">
        <div class="face" v-if="!flipped">{{ current.front }}</div>
        <div class="face" v-else>{{ current.back }}</div>
      </div>
    </div>
</template>

<style scoped>
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
.face {
  padding: 1rem;
}
/* .back {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
} */
</style>