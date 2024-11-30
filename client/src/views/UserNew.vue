<template>
  <div class="user-new">
    <h1>Create New User</h1>
    <form
      class="user-form"
      @submit.prevent="handleSubmit"
    >
      <div class="form-group">
        <label for="name">Name:</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
        >
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
        >
      </div>
      <div class="actions">
        <router-link
          to="/users"
          class="cancel-btn"
        >
          Cancel
        </router-link>
        <button
          type="submit"
          class="submit-btn"
        >
          Create User
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const form = reactive({
    name: '',
    email: '',
  })

  const handleSubmit = () => {
    // Implementation for user creation will be added here
    console.log('Form submitted:', form)
    // After successful creation, redirect to user list
    router.push('/users').catch(() => {})
  }
</script>

<style scoped>
  .user-new {
    padding: 20px;
  }

  .user-form {
    max-width: 500px;
    margin: 20px 0;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .actions {
    margin-top: 20px;
    display: flex;
    gap: 10px;
  }

  .submit-btn {
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .submit-btn:hover {
    background-color: #45a049;
  }

  .cancel-btn {
    padding: 8px 16px;
    background-color: #f44336;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }

  .cancel-btn:hover {
    background-color: #da190b;
  }
</style>
