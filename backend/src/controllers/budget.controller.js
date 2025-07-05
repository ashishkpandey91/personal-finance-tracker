import { db } from "../db.js";
export const setBudget = async (req, res) => {
  const userId = req.user.id;
  const { category, budget, month, year } = req.body;

  try {
    const categoryCheck = await db.query(
      `SELECT id, category_name FROM expense_categories WHERE id = $1 AND user_id = $2`,
      [category, userId]
    );

    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid category for user." });
    }

    const existingBudget = await db.query(
      `SELECT id FROM categories_budget 
       WHERE expense_categories_id = $1 AND month = $2 AND year = $3`,
      [category, month, year]
    );

    if (existingBudget.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Budget already set for this category and period." });
    }

    const insert = await db.query(
      `INSERT INTO categories_budget (expense_categories_id, budget, month, year, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id`,
      [category, budget, month, year]
    );

    res.status(201).json({
      id: insert.rows[0].id,
      category: categoryCheck.rows[0].category_name,
      budget,
      month,
      year,
      expense: "0",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to set budget" });
  }
};

export const updateBudget = async (req, res) => {
  const userId = req.user.id;
  const { category, budget, month, year } = req.body;

  try {
    // Validate category ownership
    const categoryCheck = await db.query(
      `SELECT category_name FROM expense_categories WHERE id = $1 AND user_id = $2`,
      [category, userId]
    );

    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid category for user." });
    }

    const updated = await db.query(
      `UPDATE categories_budget
       SET budget = $1, updated_at = NOW()
       WHERE expense_categories_id = $2 AND month = $3 AND year = $4
       RETURNING id`,
      [budget, category, month, year]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ error: "Budget not found to update." });
    }

    // Get updated expense
    const expenseResult = await db.query(
      `SELECT COALESCE(SUM(amount), 0) AS expense
       FROM transactions
       WHERE category_id = $1 AND transaction_type = 'expense'
       AND EXTRACT(MONTH FROM transaction_date) = $2::int
       AND EXTRACT(YEAR FROM transaction_date) = $3::int`,
      [category, month, year]
    );

    res.json({
      id: updated.rows[0].id,
      category: categoryCheck.rows[0].category_name,
      budget: parseFloat(budget),
      month,
      year,
      expense: expenseResult.rows[0].expense.toString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update budget" });
  }
};

export const getBudgets = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(`
      SELECT 
        cb.id,
        cb.month,
        cb.year,
        cb.budget,
        ec.category_name AS category,
        COALESCE(SUM(t.amount), 0) AS expense
      FROM categories_budget cb
      JOIN expense_categories ec ON cb.expense_categories_id = ec.id
      LEFT JOIN transactions t 
        ON t.category_id = ec.id 
        AND t.transaction_type = 'expense'
        AND EXTRACT(MONTH FROM t.transaction_date) = 
          CASE cb.month
            WHEN 'jan' THEN 1
            WHEN 'feb' THEN 2
            WHEN 'mar' THEN 3
            WHEN 'apr' THEN 4
            WHEN 'may' THEN 5
            WHEN 'jun' THEN 6
            WHEN 'jul' THEN 7
            WHEN 'aug' THEN 8
            WHEN 'sep' THEN 9
            WHEN 'oct' THEN 10
            WHEN 'nov' THEN 11
            WHEN 'dec' THEN 12
          END
        AND EXTRACT(YEAR FROM t.transaction_date) = cb.year::INT
      WHERE ec.user_id = $1
      GROUP BY cb.id, ec.category_name
      ORDER BY cb.year DESC, cb.month DESC
    `, [userId]);

    const budgets = result.rows.map(row => ({
      id: row.id,
      category: row.category,
      budget: parseFloat(row.budget),
      month: row.month,
      year: row.year,
      expense: row.expense
    }));

    res.json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
};

