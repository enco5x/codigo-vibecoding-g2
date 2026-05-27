import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));

const swaggerDocument = yaml.load(
  readFileSync(join(__dirname, "swagger.yaml"), "utf8")
);

export const swaggerMiddleware = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocument);
  });
};