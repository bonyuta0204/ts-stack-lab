import { resetUsersCache } from "../src/services/cacheService";

resetUsersCache().catch((error) => {
  console.error("Error resetting cache:", error);
});
