import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import { setupSwagger } from './swagger';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Setup Swagger UI
setupSwagger(app);

// Routes
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

export default app;
