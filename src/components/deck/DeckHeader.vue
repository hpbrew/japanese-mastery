<script lang="ts" setup>
import { toRefs } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps<{
  id: string,
  name: string,
}>();

const {id, name} = toRefs(props)

function goBack() {
  router.push({ name: "home" });
}

</script>
<template>
  <header class="deck-header">
    <button class="back" @click="goBack">← Back</button>
    <h1>{{ name }}</h1>
  </header>
</template>

<style scoped>
.deck-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.deck-header button {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  cursor: pointer;
}
</style>