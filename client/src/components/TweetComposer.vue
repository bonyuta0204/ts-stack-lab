<script setup lang="ts">
import { ref } from 'vue'
import { tweetService } from '../services/tweetService'
import { useQueryClient } from '@tanstack/vue-query'

const content = ref('')
const isSubmitting = ref(false)
const queryClient = useQueryClient()

// TODO: Get the actual user ID from auth context
const currentUserId = 1

async function handleSubmit() {
  if (!content.value.trim()) return

  try {
    isSubmitting.value = true
    await tweetService.createTweet({
      content: content.value,
      authorId: currentUserId,
    })
    content.value = ''
    // Invalidate tweets query to refresh the timeline
    queryClient.invalidateQueries({ queryKey: ['tweets'] })
  } catch (error) {
    console.error('Failed to create tweet:', error)
    // TODO: Show error message to user
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="tweet-composer">
    <textarea
      v-model="content"
      placeholder="What's happening?"
      :disabled="isSubmitting"
      @keydown.ctrl.enter="handleSubmit"
      @keydown.meta.enter="handleSubmit"
    ></textarea>
    <div class="composer-footer">
      <span class="char-count" :class="{ 'near-limit': content.length > 240 }">
        {{ 280 - content.length }}
      </span>
      <button
        class="tweet-button"
        @click="handleSubmit"
        :disabled="isSubmitting || !content.trim() || content.length > 280"
      >
        Tweet
      </button>
    </div>
  </div>
</template>

<style scoped>
.tweet-composer {
  padding: 1rem;
  border-bottom: 1px solid #e1e8ed;
}

textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.5rem;
  border: none;
  resize: vertical;
  font-size: 1.1rem;
  font-family: inherit;
}

textarea:focus {
  outline: none;
}

.composer-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 0.5rem;
}

.char-count {
  margin-right: 1rem;
  color: #536471;
}

.char-count.near-limit {
  color: #ff4136;
}

.tweet-button {
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;
}

.tweet-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tweet-button:hover:not(:disabled) {
  background-color: #1a91da;
}
</style>
