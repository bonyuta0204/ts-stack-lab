<script setup lang="ts">
  import type { Tweet } from '../services/tweetService'
  import { formatDistanceToNow } from 'date-fns'
  import { computed } from 'vue'

  const props = defineProps<{
    tweet: Tweet
  }>()

  const timeAgo = computed(() => {
    return formatDistanceToNow(new Date(props.tweet.createdAt), { addSuffix: true })
  })
</script>

<template>
  <div class="tweet-item">
    <div class="tweet-header">
      <span class="author-name">{{ tweet.author.name }}</span>
      <span class="author-email">@{{ tweet.author.email.split('@')[0] }}</span>
      <span class="tweet-time">· {{ timeAgo }}</span>
    </div>
    <div class="tweet-content">
      {{ tweet.content }}
    </div>
  </div>
</template>

<style scoped>
  .tweet-item {
    padding: 1rem;
    border-bottom: 1px solid #e1e8ed;
  }

  .tweet-item:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  .tweet-header {
    margin-bottom: 0.5rem;
  }

  .author-name {
    font-weight: bold;
    margin-right: 0.5rem;
  }

  .author-email {
    color: #536471;
    margin-right: 0.5rem;
  }

  .tweet-time {
    color: #536471;
  }

  .tweet-content {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
