import { db } from "../db.js";

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Todo: check if the category already exists

    // Add
    const result = await db.query(
      "INSERT INTO expense_categories (category_name, user_id) VALUES ($1, $2) RETURNING *",
      [name, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ error: "Category creation failed" });
    }

    const category = result.rows[0];

    res.status(201).json({
      message: "Category added successfully",
      category: {
        id: category.id,
        name: category.category_name,
        userId: category.user_id,
      },
    });
  } catch (error) {
    console.error("Error adding category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserCategories = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      "SELECT id, category_name FROM expense_categories WHERE user_id = $1",
      [userId]
    );

    res.status(200).json({
      categories: result.rows,
    });
  } catch (error) {
    console.error("Error fetching user categories:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const setCategoryBudget = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId);

    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    let { budget, year, month } = req.body;
    budget = parseFloat(budget);
    year = parseInt(year);

    if (isNaN(budget)) {
      return res.status(400).json({
        error: "Budget must be a valid number, received " + req.body.budget,
      });
    }
    // Check if the category exists

    const categoryResult = await db.query(
      "SELECT * FROM expense_categories WHERE id = $1 AND user_id = $2",

      [categoryId, req.user.id]
    );

    if (categoryResult.rowCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Update the budget for the category

    const result = await db.query(
      "UPDATE expense_categories SET budget = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [budget, categoryId, req.user.id]
    );
    if (result.rowCount === 0) {
      return res.status(400).json({ error: "Failed to set category budget" });
    }
    const updatedCategory = result.rows[0];
    res.status(200).json({
      message: "Category budget set successfully",
      category: {
        id: updatedCategory.id,
        name: updatedCategory.category_name,
        budget: updatedCategory.budget,
        userId: updatedCategory.user_id,
      },
    });
  } catch (error) {
    console.error("Error setting category budget:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

