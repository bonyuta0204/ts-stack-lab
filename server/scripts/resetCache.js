import { exit } from "process";
import { resetUsersCache, resetUserCountCache, } from "../src/services/cacheService.js";
import { redisClient } from "../src/config/redisClient.js";
/**
 * Script to reset all cache entries in Redis.
 * This will clear both the users cache and the user count cache.
 */
try {
    await Promise.all([resetUsersCache(), resetUserCountCache()]);
}
catch (error) {
    console.error("Failed to reset cache:", error);
}
finally {
    await redisClient.quit();
    exit(0);
}
