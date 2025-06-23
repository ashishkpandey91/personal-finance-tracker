import { db } from "../db.js";
import bcrypt from "bcrypt";
import { generateJwt } from "../utils/jwt.js";

export async function createUser(req, res) {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // TODO: Check if the user already exists

    const hashPassword = await bcrypt.hash(password, 10);

    const response = await db.query(
      "INSERT INTO users (email, password, full_name) VALUES ($1, $2, $3) RETURNING *",
      [email, hashPassword, fullName]
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

    console.log("Login attempt for email:", email);

    const response = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (response.rowCount === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = response.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        createdAt: user.created_at,
      },
      token: generateJwt({ id: user.id, email: user.email }),
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
