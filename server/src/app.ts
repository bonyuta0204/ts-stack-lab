import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import tweetRoutes from "./routes/tweetRoutes";
import { setupSwagger } from "./swagger";
import { httpLogging } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(httpLogging);

// Setup Swagger UI
setupSwagger(app);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tweets", tweetRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
