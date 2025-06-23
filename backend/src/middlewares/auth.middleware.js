import { verifyJwt } from "../utils/jwt.js";

export const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = verifyJwt(token);

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user; // Attach user info to the request object

    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
