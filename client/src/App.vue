<script setup lang="ts">
  const title = 'TS Stack Lab'
  import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
</script>

<template>
  <p>{{ title }}</p>
  <router-view />
  <vue-query-devtools />
</template>

<style>
  #app {
    font-family: Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
