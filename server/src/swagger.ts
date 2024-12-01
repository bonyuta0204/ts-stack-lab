import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { Express } from "express";
import path from "path";

export const setupSwagger = (app: Express) => {
  // Load OpenAPI spec from the api-docs directory (one level up from server)
  const swaggerDocument = YAML.load(
    path.join(import.meta.dirname, "../../api-docs/openapi.yaml"),
  ) as object;

  // Serve Swagger UI at /api-docs endpoint
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
