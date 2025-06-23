import dotenv from "dotenv";

dotenv.config({
  path: ["./.env"],
});

class EnvConfig {
  #envVars = {};
  constructor() {
    this.#envVars = process.env;
  }

  get(key) {
    const value = this.#envVars[key];
    if (value === undefined) {
      throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
  }
}

export const envConfig = new EnvConfig();
