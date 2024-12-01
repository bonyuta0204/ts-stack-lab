<script setup lang="ts">
  import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
</script>

<template>
  <div class="app-container">
    <nav class="nav-bar">
      <router-link
        to="/"
        class="nav-item"
      >
        Home
      </router-link>
      <router-link
        to="/users"
        class="nav-item"
      >
        Users
      </router-link>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
  </div>
  <vue-query-devtools />
</template>

<style>
  #app {
    font-family: Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .app-container {
    display: flex;
    min-height: 100vh;
  }

  .nav-bar {
    width: 200px;
    padding: 1rem;
    border-right: 1px solid #e1e8ed;
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .nav-item {
    display: block;
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    text-decoration: none;
    border-radius: 9999px;
    font-weight: bold;
    font-size: 1.25rem;
  }

  .nav-item:hover {
    background-color: rgba(29, 161, 242, 0.1);
    color: #1da1f2;
  }

  .nav-item.router-link-active {
    color: #1da1f2;
  }

  .main-content {
    flex: 1;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
