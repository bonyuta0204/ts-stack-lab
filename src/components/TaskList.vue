<script setup lang="ts">
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

defineProps<{
  tasks: Task[] | undefined;
  isToggling: boolean;
  isDeleting: boolean;
}>();

defineEmits<{
  (e: 'toggleTask', payload: { id: number; completed: boolean }): void;
  (e: 'deleteTask', id: number): void;
}>();
</script>

<template>
  <div class="space-y-4">
    <template v-if="tasks && tasks.length > 0">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="flex items-center justify-between p-4 bg-white rounded-lg shadow"
      >
        <div class="flex items-center gap-4">
          <input
            type="checkbox"
            :checked="task.completed"
            :disabled="isToggling"
            @change="$emit('toggleTask', { id: task.id, completed: !task.completed })"
            class="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span :class="{ 'line-through text-gray-500': task.completed }">
            {{ task.title }}
          </span>
        </div>
        
        <button
          @click="$emit('deleteTask', task.id)"
          :disabled="isDeleting"
          class="text-red-500 hover:text-red-700 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </template>
    
    <div v-else class="text-center py-4 text-gray-500">
      No tasks yet. Add one above!
    </div>
  </div>
</template>