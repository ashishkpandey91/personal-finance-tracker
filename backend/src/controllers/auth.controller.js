import { db } from "../db.js";
import bcrypt from "bcrypt";
import { generateJwt, verifyJwt } from "../utils/jwt.js";

export async function createUser(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // TODO: Check if the user already exists

    const hashPassword = await bcrypt.hash(password, 10);

    const response = await db.query(
      "INSERT INTO users (email, password, full_name) VALUES ($1, $2, $3) RETURNING *",
      [email, hashPassword, name]
    );

    if (response.rowCount === 0) {
      return res.status(400).json({ error: "User creation failed" });
    }

    const user = response.rows[0];

    const token = generateJwt({ id: user.id, email: user.email });

    res.status(201).send({
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log(`[LOGIN_ATTEMPT] Email: ${email}`);

    const response = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (response.rowCount === 0) {
      console.warn(`[LOGIN_FAILED] Email not found: ${email}`);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = response.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.warn(`[LOGIN_FAILED] Invalid password for email: ${email}`);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateJwt({ id: user.id, email: user.email });

    console.info(`[LOGIN_SUCCESS] User ID: ${user.id}`);
    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        createdAt: user.created_at,
      },
      token,
    });

  } catch (error) {
    console.error("[LOGIN_ERROR] Internal error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJwt(token);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const userId = decoded.id;

    const response = await db.query(
      "SELECT id, email, full_name FROM users WHERE id = $1",
      [userId]
    );

    if (response.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = response.rows[0];

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
