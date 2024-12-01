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

      <button @click="onClickLoadMore">Load More</button>
    </div>
    <div class="users-container">
      <div
        v-if="isLoading"
        class="loading"
      >
        Loading users...
      </div>
      <div
        v-else-if="error"
        class="error"
      >
        Error: {{ (error as Error).message }}
      </div>
      <div
        v-else-if="users && users.length > 0"
        class="users-grid"
      >
        <div
          v-for="user in users"
          :key="user.id"
          class="user-card"
        >
          <h3>{{ user.name }}</h3>
          <p>{{ user.email }}</p>
        </div>
      </div>
      <div
        v-else
        class="no-users"
      >
        No users found
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useInfiniteQuery } from '@tanstack/vue-query'
  import { getUsers } from '../services/api'
  import { computed } from 'vue'

  const {
    data: userResponse,
    fetchNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    initialPageParam: 1,
    getNextPageParam: (_, pages) => {
      return pages.length + 1
    },
  })

  function fetchUsers({ pageParam = 1 }) {
    return getUsers({ page: pageParam, pageSize: 50 })
  }

  function onClickLoadMore() {
    fetchNextPage().catch((error) => {
      console.error('Error loading more users:', error)
    })
  }

  const users = computed(() => userResponse.value?.pages.flatMap((page) => page.items) || [])
</script>

<style scoped>
  .user-list {
    padding: 20px;
  }

  .actions {
    margin-bottom: 20px;
  }

  .new-user-btn {
    display: inline-block;
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  .new-user-btn:hover {
    background-color: #45a049;
  }

  .users-container {
    margin-top: 20px;
  }

  .users-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .user-card {
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .user-card h3 {
    margin: 0 0 10px 0;
    color: #2c3e50;
  }

  .user-card p {
    margin: 0;
    color: #666;
  }

  .loading,
  .error,
  .no-users {
    text-align: center;
    padding: 20px;
    color: #666;
  }

  .error {
    color: #dc3545;
  }
</style>
