<script setup lang="ts">
  import { ref } from 'vue'
  import { useQuery } from '@tanstack/vue-query'
  import { tweetService } from '../services/tweetService'
  import TweetItem from '../components/TweetItem.vue'
  import TweetComposer from '../components/TweetComposer.vue'

  const page = ref(1)
  const pageSize = 10

  // TODO: Get the actual user ID from auth context
  const currentUserId = 1

  const {
    data: timeline,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tweets', 'timeline', currentUserId, page],
    queryFn: () => tweetService.getTimeline(currentUserId, page.value, pageSize),
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
  })

  function loadMore() {
    if (timeline.value && page.value < timeline.value.totalPages) {
      page.value++
    }
  }
</script>

<template>
  <div class="timeline">
    <header class="timeline-header">
      <h1>Home</h1>
    </header>

    <TweetComposer />

    <div
      v-if="isLoading && !timeline"
      class="loading"
    >
      <div class="loading-spinner" />
      Loading tweets...
    </div>

    <div
      v-else-if="error"
      class="error"
    >
      Failed to load tweets. Please try again later.
    </div>

    <template v-else-if="timeline">
      <TweetItem
        v-for="tweet in timeline.items"
        :key="tweet.id"
        :tweet="tweet"
      />

      <div
        v-if="timeline.page < timeline.totalPages"
        class="load-more"
      >
        <button
          :disabled="isLoading"
          @click="loadMore"
        >
          {{ isLoading ? 'Loading...' : 'Load more' }}
        </button>
      </div>

      <div
        v-else-if="timeline.items.length === 0"
        class="empty-state"
      >
        No tweets yet. Follow some users to see their tweets here!
      </div>
    </template>
  </div>
</template>

<style scoped>
  .timeline {
    max-width: 600px;
    margin: 0 auto;
    border: 1px solid #e1e8ed;
    border-top: none;
    min-height: 100vh;
  }

  .timeline-header {
    padding: 1rem;
    border-bottom: 1px solid #e1e8ed;
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
  }

  .timeline-header h1 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: bold;
  }

  .loading,
  .error,
  .empty-state {
    padding: 2rem;
    text-align: center;
    color: #536471;
  }

  .loading-spinner {
    display: inline-block;
    width: 30px;
    height: 30px;
    border: 3px solid #e1e8ed;
    border-radius: 50%;
    border-top-color: #1da1f2;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error {
    color: #ff4136;
  }

  .load-more {
    padding: 1rem;
    text-align: center;
  }

  .load-more button {
    background-color: transparent;
    border: none;
    color: #1da1f2;
    font-weight: bold;
    cursor: pointer;
    padding: 0.5rem 1rem;
  }

  .load-more button:hover:not(:disabled) {
    background-color: rgba(29, 161, 242, 0.1);
    border-radius: 9999px;
  }

  .load-more button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
