import { exit } from "process";
import {
  resetUsersCache,
  resetUserCountCache,
} from "../src/services/cacheService";
import { redisClient } from "../src/config/redisClient";

/**
 * Script to reset all cache entries in Redis.
 * This will clear both the users cache and the user count cache.
 */
Promise.all([resetUsersCache(), resetUserCountCache()])
  .then(() => {
    console.log("Cache reset successfully");
    return redisClient.quit();
  })
  .then(() => {
    exit(0);
  })
  .catch((error) => {
    console.error("Failed to reset cache:", error);
    redisClient
      .quit()
      .finally(() => exit(1))
      .catch((error) => {
        console.error("Failed to close Redis client:", error);
        exit(1);
      });
  });
