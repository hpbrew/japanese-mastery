<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import DeckSelect from "./components/DeckSelect.vue";
</script>

<template>
  <div class="app-root">
    <!-- <header class="app-header">
      <div class="wrapper">
        <nav class="main-nav">
          <RouterLink to="/">Decks</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </div>
    </header> -->

    <main class="app-main">
      <RouterView />
    </main>

    <!-- <footer class="app-footer">
      <DeckSelect />
    </footer> -->
  </div>
</template>

<style scoped>
.app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.main-nav {
  width: 100%;
  font-size: 14px;
  text-align: center;
  padding: 0.75rem 0;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

.app-main {
  flex: 1 1 auto;
  padding: 1.25rem;
}

.app-footer {
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  padding: 0.75rem 1rem;
}
</style>
