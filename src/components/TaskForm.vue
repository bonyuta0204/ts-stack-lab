<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'createTask', title: string): void;
}>();

const newTaskTitle = ref('');

const handleSubmit = () => {
  if (newTaskTitle.value.trim()) {
    emit('createTask', newTaskTitle.value);
    newTaskTitle.value = '';
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="mb-8">
    <div class="flex gap-4">
      <input
        v-model="newTaskTitle"
        type="text"
        placeholder="Add a new task..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="isLoading"
      />
      <button
        type="submit"
        :disabled="isLoading || !newTaskTitle.trim()"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {{ isLoading ? 'Adding...' : 'Add Task' }}
      </button>
    </div>
  </form>
</template>