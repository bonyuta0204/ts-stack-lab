<template>
  <div class="register-form">
    <h2>Register</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          required
          class="form-control"
        />
      </div>
      <div
        v-if="error"
        class="error"
      >
        {{ error }}
      </div>
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="loading"
      >
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
      <button
        type="button"
        class="btn btn-google"
        :disabled="loading"
        @click="handleGoogleSignup"
      >
        Sign up with Google
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { authService } from '../../services/authService'

  const name = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const error = ref('')
  const loading = ref(false)

  const isValid = computed(() => {
    return (
      name.value.length > 0 &&
      email.value.length > 0 &&
      password.value.length >= 6 &&
      password.value === confirmPassword.value
    )
  })

  const handleSubmit = async () => {
    if (!isValid.value) {
      error.value = 'Please check your input fields.'
      return
    }

    try {
      loading.value = true
      error.value = ''
      await authService.register(email.value, password.value)
      // Emit success event or handle navigation
    } catch (err) {
      error.value = 'Failed to register. Please try again.'
      console.error('Registration error:', err)
    } finally {
      loading.value = false
    }
  }

  const handleGoogleSignup = async () => {
    try {
      loading.value = true
      error.value = ''
      await authService.loginWithGoogle()
      // Emit success event or handle navigation
    } catch (err) {
      error.value = 'Failed to sign up with Google.'
      console.error('Google signup error:', err)
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
  .register-form {
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
