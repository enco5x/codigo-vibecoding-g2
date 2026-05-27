import express from "express";
import cors from "cors";
import { swaggerMiddleware } from "./docs/swagger.js";

const app = express();

app.use(cors());
app.use(express.json());

swaggerMiddleware(app);

export default app;