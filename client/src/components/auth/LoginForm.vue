<template>
  <div class="login-form">
    <h2>Login</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          class="form-control"
        />
      </div>
      <div class="error" v-if="error">{{ error }}</div>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <button
        type="button"
        class="btn btn-google"
        @click="handleGoogleLogin"
        :disabled="loading"
      >
        Login with Google
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { authService } from '../../services/authService';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = '';
    await authService.login(email.value, password.value);
    // Emit success event or handle navigation
  } catch (err) {
    error.value = 'Failed to login. Please check your credentials.';
    console.error('Login error:', err);
  } finally {
    loading.value = false;
  }
};

const handleGoogleLogin = async () => {
  try {
    loading.value = true;
    error.value = '';
    await authService.loginWithGoogle();
    // Emit success event or handle navigation
  } catch (err) {
    error.value = 'Failed to login with Google.';
    console.error('Google login error:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #1da1f2;
  color: white;
}

.btn-google {
  background-color: #db4437;
  color: white;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}
</style>
