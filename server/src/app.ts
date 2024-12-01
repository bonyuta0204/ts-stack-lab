import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import tweetRoutes from "./routes/tweetRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { setupSwagger } from "./swagger.js";
import { httpLogging } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { initializeFirebase } from "./config/firebase.js";

// Initialize Firebase Admin
initializeFirebase();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(httpLogging);

// Setup Swagger UI
setupSwagger(app);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tweets", tweetRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
