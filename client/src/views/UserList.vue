<template>
  <div class="user-list">
    <h1>Users</h1>
    <div class="actions">
      <router-link
        to="/users/new"
        class="new-user-btn"
      >
        New User
      </router-link>
    </div>
    <div class="users-container">
      <!-- User list will be implemented here -->
      <p>User list coming soon...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Component logic will be added here
</script>

<style scoped>
  .user-list {
    padding: 20px;
  }

  .actions {
    margin: 20px 0;
  }

  .new-user-btn {
    display: inline-block;
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }

  .new-user-btn:hover {
    background-color: #45a049;
  }
</style>
