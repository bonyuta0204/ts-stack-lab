import { createClient } from "@redis/client";
import { RedisClientType } from "@redis/client/dist/lib/client";
import {
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "@redis/client/dist/lib/commands";

async function runRedisClient() {
  const client = createClient();

  client.on("error", (err) => {
    console.error("Redis Client Error:", err);
  });

  try {
    await client.connect();
    console.log("Redis client connected");

    // Set a key-value pair with a TTL of 60 seconds
    await setValue(client, "key", "value");

    const res1 = await client.hSet("bike:1", {
      model: "Deimos",
      brand: "Ergonom",
      type: "Enduro bikes",
      price: 4972,
    });
    console.log(res1); // 4

    const res2 = await client.hGet("bike:1", "model");
    console.log(res2); // 'Deimos'

    const res3 = await client.hGet("bike:1", "price");
    console.log(res3); // '4972'

    const res4 = await client.hGetAll("bike:1");
    console.log(res4);
  } catch (err) {
    console.error("Redis operation error:", err);
  } finally {
    // Close the client connection
    await client.quit();
    console.log("Redis client disconnected");
  }
}

type Client = RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

async function setValue(client: Client, key: string, value: string) {
  await client.set(key, value);
}

runRedisClient().catch((err) => {
  console.error("Error running Redis client:", err);
});
