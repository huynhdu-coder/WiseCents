import pool from "../config/database.js";

export const getMonthlyReport = async (req, res) => {
  try {
    const userId = req.userId;
    const { month } = req.query; 

    if (!month) {
      return res.status(400).json({ error: "Month is required (YYYY-MM)" });
    }

  
    const daily = await pool.query(
      `
      SELECT
        DATE(date) AS day,
        SUM(ABS(amount)) AS total
      FROM transactions
      WHERE user_id = $1
        AND amount < 0
        AND DATE_TRUNC('month', date) = DATE_TRUNC('month', $2::date)
      GROUP BY day
      ORDER BY day
      `,
      [userId, `${month}-01`]
    );

  
    const categories = await pool.query(
      `
      SELECT
        category,
        SUM(ABS(amount)) AS total
      FROM transactions
      WHERE user_id = $1
        AND amount < 0
        AND DATE_TRUNC('month', date) = DATE_TRUNC('month', $2::date)
      GROUP BY category
      ORDER BY total DESC
      `,
      [userId, `${month}-01`]
    );

    res.json({
      daily: daily.rows,
      categories: categories.rows,
    });
  } catch (err) {
    console.error("MONTHLY REPORT ERROR:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
};
