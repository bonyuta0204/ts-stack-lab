import { User } from "@prisma/client";
import { redisClient } from "../config/redisClient";

// Constants
const KEY_PREFIX = "app:";

/**
 * Generate a consistent Redis key with prefix.
 * @param key - The base key to be prefixed
 * @returns Prefixed key
 */
const generateKey = <T extends string>(key: T): `${typeof KEY_PREFIX}${T}` => {
  return `${KEY_PREFIX}${key}`;
};

const usersKey = generateKey("users");
const userCountKey = generateKey("userCount");

// Read Operations
/**
 * Get user data from cache within a specified range.
 * @param start - Start index (default: 0)
 * @param end - End index (default: -1, meaning all users)
 * @returns Array of users or null if not found
 */
export const readUsersFromCache = async (
  start: number = 0,
  end: number = -1
): Promise<Omit<User, "password">[] | null> => {
  const key = usersKey;

  try {
    const results = await redisClient.zRangeWithScores(key, start, end);

    if (results && results.length > 0) {
      return results.map((item) => JSON.parse(item.value) as User);
    }
    return null;
  } catch (error) {
    console.error(`Failed to read cache for key: ${key}`, error);
    return null;
  }
};

/**
 * Get total user count from cache.
 * @returns Total user count or null if not found
 */
export const readUserCountFromCache = async (): Promise<number | null> => {
  const key = userCountKey;

  try {
    const count = await redisClient.get(key);
    if (count) {
      return parseInt(count);
    }
    return null;
  } catch (error) {
    console.error(`Failed to read cache for key: ${key}`, error);
    return null;
  }
};

// Write Operations
/**
 * Write user data to cache.
 * @param users - Array of users to cache
 */
export const writeUsersToCache = async (
  users: Omit<User, "password">[]
): Promise<void> => {
  const key = usersKey;

  const values = users.map((user) => ({
    score: user.id,
    value: JSON.stringify(user),
  }));

  try {
    await redisClient.zAdd(key, values);
    console.log(`Cache set for key: ${key}`);
  } catch (error) {
    console.error(`Failed to set cache for key: ${key}`, error);
  }
};

/**
 * Write total user count to cache.
 * @param count - Total user count to cache
 */
export const writeUserCountToCache = async (count: number): Promise<void> => {
  const key = userCountKey;
  try {
    await redisClient.set(key, count);
    console.log(`Cache set for key: ${key}`);
  } catch (error) {
    console.error(`Failed to set cache for key: ${key}`, error);
  }
};

// Delete Operations
/**
 * Delete specific user data from cache.
 * @param userId - ID of user to delete from cache
 */
export const deleteUserFromCache = async (userId: string): Promise<void> => {
  const key = generateKey(userId);

  try {
    await redisClient.del(key);
    console.log(`Cache deleted for key: ${key}`);
  } catch (error) {
    console.error(`Failed to delete cache for key: ${key}`, error);
  }
};

/**
 * Delete all user data from cache.
 */
export const resetUsersCache = async (): Promise<void> => {
  const key = usersKey;
  try {
    await redisClient.del(key);
    console.log(`Cache deleted for key: ${key}`);
  } catch (error) {
    console.error(`Failed to delete cache for key: ${key}`, error);
  }
};

/**
 * Delete total user count from cache.
 */
export const resetUserCountCache = async (): Promise<void> => {
  const key = userCountKey;
  try {
    await redisClient.del(key);
    console.log(`Cache deleted for key: ${key}`);
  } catch (error) {
    console.error(`Failed to delete cache for key: ${key}`, error);
  }
};
