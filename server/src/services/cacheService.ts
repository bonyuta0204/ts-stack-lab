import { User } from "@prisma/client";
import { redisClient } from "../config/redisClient";

const KEY_PREFIX = "app:";

/**
 * Generate a consistent Redis key.
 */
const generateKey = <T extends string>(key: T): `${typeof KEY_PREFIX}${T}` => {
  return `${KEY_PREFIX}${key}`;
};

const usersKey = generateKey("users");

/**
 * Get user data from cache.
 */
export const readUserFromCache = async (
  start: number = 0,
  end: number = -1
): Promise<Omit<User, "password">[] | null> => {
  const key = usersKey;

  try {
    // Get members from the sorted set within the specified range
    const results = await redisClient.zRangeWithScores(key, start, end);

    if (results && results.length > 0) {
      // Parse each member back into a User object
      return results.map((item) => JSON.parse(item.value) as User);
    }
    return null;
  } catch (error) {
    console.error(`Failed to read cache for key: ${key}`, error);
    return null;
  }
};

/**
 * Write user data to cache.
 * @param users Array of users
 */
export const writeUserToCache = async (
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
 * Delete user data from cache.
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
