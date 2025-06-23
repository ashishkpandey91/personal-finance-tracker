import { Client } from "pg";
import { envConfig } from "./config/index.js";

const client = new Client({
  user: envConfig.get("DB_USER"),
  password: envConfig.get("DB_PASSWORD"),
  host: envConfig.get("DB_HOST"),
  port: envConfig.get("DB_PORT"),
  database: envConfig.get("DB_NAME"),
});

client.on("error", (err) => {
  console.error("Database error:", err);
});

export { client as db };
