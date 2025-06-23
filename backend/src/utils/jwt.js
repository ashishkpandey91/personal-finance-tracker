import { envConfig } from "../config/index.js";
import jwt from "jsonwebtoken";

export const generateJwt = (user) => {
  const jwtSecret = envConfig.get("JWT_SECRET");

  return jwt.sign(user, jwtSecret, {
    expiresIn: "7d", // Token will expire in 7 days
  });
};

export const verifyJwt = (token) => {
  const jwtSecret = envConfig.get("JWT_SECRET");

  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null; // Return null if verification fails
  }
};
