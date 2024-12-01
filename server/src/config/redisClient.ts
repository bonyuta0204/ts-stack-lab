import { createClient } from "@redis/client";

export const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.connect().catch((err) => {
  console.error("Redis Client Connection Error:", err);
});
