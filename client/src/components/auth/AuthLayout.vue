<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-tabs">
        <button
          :class="['tab-btn', { active: currentView === 'login' }]"
          @click="currentView = 'login'"
        >
          Login
        </button>
        <button
          :class="['tab-btn', { active: currentView === 'register' }]"
          @click="currentView = 'register'"
        >
          Register
        </button>
      </div>

      <Transition
        name="fade"
        mode="out-in"
      >
        <LoginForm v-if="currentView === 'login'" />
        <RegisterForm v-else />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import LoginForm from './LoginForm.vue'
  import RegisterForm from './RegisterForm.vue'

  const currentView = ref('login')
</script>

<style scoped>
  .auth-layout {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f8fa;
  }

  .auth-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 480px;
  }

  .auth-tabs {
    display: flex;
    border-bottom: 1px solid #e1e8ed;
  }

  .tab-btn {
    flex: 1;
    padding: 1rem;
    border: none;
    background: none;
    font-size: 1rem;
    cursor: pointer;
    color: #657786;
  }

  .tab-btn.active {
    color: #1da1f2;
    border-bottom: 2px solid #1da1f2;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
