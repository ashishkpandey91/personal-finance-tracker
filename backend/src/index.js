import express from "express";
import { envConfig } from "./config/index.js";
import { db } from "./db.js";
import router from "./routes/index.js";
import cors from "cors"; //

const app = express();
const PORT = envConfig.get("PORT");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1/api", router);

async function startServer() {
  try {
    await db.connect();
    console.log("Connected to the database successfully: ", db.host);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}

startServer();
