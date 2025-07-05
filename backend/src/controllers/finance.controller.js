import { db } from "../db.js";

export const getTransactions = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(
      `
      SELECT t.id, t.transaction_type AS type, t.amount, t.transaction_description AS description,
             t.transaction_date AS date, c.category_name AS category
      FROM transactions t
      JOIN expense_categories c ON t.category_id = c.id
      WHERE t.user_id = $1
      ORDER BY t.created_at DESC
    `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

export const addTransaction = async (req, res) => {
  const userId = req.user.id;
  const { category, type, amount, description, date } = req.body;
  try {
    console.log("userid: ", userId);

    if (!Number(category) || !type || !amount || !description || !date) {
      return res.status(400).json({ error: "all field not required" });
    }

    const insertRes = await db.query(
      `WITH inserted AS (
            INSERT INTO transactions (
              user_id, category_id, transaction_type, amount,
              transaction_description, transaction_date
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
          )
          SELECT
            inserted.id,
            inserted.transaction_type AS type,
            inserted.amount,
            inserted.transaction_description AS description,
            inserted.transaction_date AS date,
            c.category_name AS category
          FROM inserted
          JOIN expense_categories c ON c.id = inserted.category_id`,
      [userId, category, type, amount, description, date]
    );

    res.status(201).json(insertRes.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add transaction" });
  }
};






