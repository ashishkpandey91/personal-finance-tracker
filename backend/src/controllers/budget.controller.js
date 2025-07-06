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
  const userId = req.user?.id; 
  const { id } = req.params; 
  const { budget } = req.body;

  try {
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No user ID" });
    }

    if (!id || !budget) {
      return res.status(400).json({ error: "Budget ID and amount are required." });
    }

    console.log("Updating budget:", { id, userId, budget });

    // Check if the budget exists and belongs to the user
    const check = await db.query(
      `SELECT cb.id, ec.category_name, cb.month, cb.year, ec.id AS category_id
       FROM categories_budget cb
       JOIN expense_categories ec ON cb.expense_categories_id = ec.id
       WHERE cb.id = $1 AND ec.user_id = $2`,
      [id, userId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Budget not found or unauthorized." });
    }

    const categoryId = check.rows[0].category_id;
    const month = check.rows[0].month;
    const year = check.rows[0].year;
    const categoryName = check.rows[0].category_name;

    // Update the budget only
    const updated = await db.query(
      `UPDATE categories_budget
       SET budget = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id`,
      [budget, id]
    );

    // Fetch updated expense
    const expenseResult = await db.query(
      `SELECT COALESCE(SUM(amount), 0) AS expense
       FROM transactions
       WHERE category_id = $1 AND transaction_type = 'expense'
         AND EXTRACT(MONTH FROM transaction_date) = $2::int
         AND EXTRACT(YEAR FROM transaction_date) = $3::int`,
      [categoryId, monthToNumber(month), year]
    );

    const expense = expenseResult.rows[0].expense;

    res.json({
      id: updated.rows[0].id,
      category: categoryName,
      budget: parseFloat(budget),
      month,
      year,
      expense: expense.toString(),
    });
  } catch (err) {
    console.error("Error in updateBudget:", err.message, err.stack);
    res.status(500).json({ error: "Failed to update budget" });
  }
};

// Helper function to convert month string to number
function monthToNumber(month) {
  const map = {
    jan: 1, feb: 2, mar: 3, apr: 4,
    may: 5, jun: 6, jul: 7, aug: 8,
    sep: 9, oct: 10, nov: 11, dec: 12,
  };
  return map[month.toLowerCase()];
}


export const deleteBudget = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params; // budget ID

  try {
    // Verify that the budget belongs to the user
    const check = await db.query(
      `SELECT cb.id
       FROM categories_budget cb
       JOIN expense_categories ec ON cb.expense_categories_id = ec.id
       WHERE cb.id = $1 AND ec.user_id = $2`,
      [id, userId]
    );

    if (check.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Budget not found or not authorized." });
    }

    // Delete the budget
    await db.query(`DELETE FROM categories_budget WHERE id = $1`, [id]);

    res.json({ message: "Budget deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete budget." });
  }
};

export const getBudgets = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `
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
    `,
      [userId]
    );

    const budgets = result.rows.map((row) => ({
      id: row.id,
      category: row.category,
      budget: parseFloat(row.budget),
      month: row.month,
      year: row.year,
      expense: row.expense,
    }));

    res.json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
};
