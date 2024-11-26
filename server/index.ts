import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const TaskSchema = z.object({
  title: z.string().min(1),
  completed: z.boolean().optional(),
});

app.get('/api/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, completed } = TaskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: { title, completed: completed ?? false },
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Invalid task data' });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { title, completed } = TaskSchema.partial().parse(req.body);
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, completed },
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Invalid task data' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({
    where: { id: Number(id) },
  });
  res.status(204).end();
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});