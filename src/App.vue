<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import axios from 'axios';
import TaskList from './components/TaskList.vue';
import TaskForm from './components/TaskForm.vue';

const API_URL = 'http://localhost:3000/api';

const queryClient = useQueryClient();

const { data: tasks, isLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: async () => {
    const { data } = await axios.get(`${API_URL}/tasks`);
    return data;
  },
});

const createTaskMutation = useMutation({
  mutationFn: async (title: string) => {
    const { data } = await axios.post(`${API_URL}/tasks`, { title });
    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
});

const toggleTaskMutation = useMutation({
  mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
    const { data } = await axios.patch(`${API_URL}/tasks/${id}`, { completed });
    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
});

const deleteTaskMutation = useMutation({
  mutationFn: async (id: number) => {
    await axios.delete(`${API_URL}/tasks/${id}`);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Task Manager</h1>
      
      <TaskForm 
        :is-loading="createTaskMutation.isPending"
        @create-task="(title) => createTaskMutation.mutate(title)" 
      />

      <div v-if="isLoading" class="text-center py-4">
        Loading tasks...
      </div>
      
      <TaskList
        v-else
        :tasks="tasks"
        :is-toggling="toggleTaskMutation.isPending"
        :is-deleting="deleteTaskMutation.isPending"
        @toggle-task="(task) => toggleTaskMutation.mutate(task)"
        @delete-task="(id) => deleteTaskMutation.mutate(id)"
      />
    </div>
  </div>
</template>