import { db } from "../db.js";

export const getTransactions = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(`
      SELECT t.id, t.transaction_type AS type, t.amount, t.transaction_description AS description,
             t.created_at AS date, c.category_name AS category
      FROM transactions t
      JOIN expense_categories c ON t.category_id = c.id
      WHERE t.user_id = $1
      ORDER BY t.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

export const addTransaction = async (req, res) => {
  const userId = req.user.id;
  const { category, type, amount, description } = req.body;
  try {
    const categoryRes = await db.query(
      `SELECT id FROM expense_categories WHERE category_name = $1 AND user_id = $2`,
      [category, userId]
    );
    if (categoryRes.rows.length === 0)
      return res.status(400).json({ error: "Category not found" });

    const categoryId = categoryRes.rows[0].id;

    const insertRes = await db.query(
      `INSERT INTO transactions (user_id, category_id, transaction_type, amount, transaction_description, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [userId, categoryId, type, amount, description]
    );

    res.status(201).json(insertRes.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add transaction" });
  }
};

export const getBudgets = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(`
      SELECT c.category_name AS category,
        SUM(CASE WHEN t.transaction_type = 'expense' THEN t.amount ELSE 0 END) AS spent
      FROM expense_categories c
      LEFT JOIN transactions t ON c.id = t.category_id
      WHERE c.user_id = $1
      GROUP BY c.category_name
    `, [userId]);

    // Example: hardcoded limits; you can extend with a separate `budgets` table
    const budgets = result.rows.map(row => ({
      category: row.category,
      spent: parseFloat(row.spent || 0),
      limit: 500, // static for now
    }));

    res.json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
};

export const updateBudget = async (req, res) => {
  // If you store limits in a separate table, this would update that.
  // For now, we’ll send back what frontend sent.
  const { category, limit } = req.body;
  return res.json({ category, limit, spent: 0 });
};
