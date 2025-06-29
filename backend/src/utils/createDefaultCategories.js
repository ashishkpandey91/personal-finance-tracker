import { db } from "../db.js";

const NEW_USER_DEFAULT_CATEGORIES = [
  "work",
  "food",
  "transport",
  "bill",
  "rent",
  "salary",
  "others",
];

export async function createDefaultCategories(userId) {
  try {
    const values = [];
    const params = [];

    NEW_USER_DEFAULT_CATEGORIES.forEach((category, i) => {
      values.push(`($1, $${i + 2})`);
      params.push(category);
    });

    const query = `INSERT INTO expense_categories (user_id, category_name)
    VALUES ${values.join(", ")}`;

    await db.query(query, [userId, ...params]);
  } catch (error) {
    console.log("Error while inserting default category for user: ", userId);
    console.log("Error: ", error);
  }
}
