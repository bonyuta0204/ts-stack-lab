import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import { setupSwagger } from "./swagger";
import { httpLogging } from "./middleware/logger";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(httpLogging);

// Setup Swagger UI
setupSwagger(app);

// Routes
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

export default app;
