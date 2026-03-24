// Takes the tx array then returns the digest string and computed stats

export function buildTransactionDigest(transactions) {
  if (!transactions || transactions.length === 0) {
    return {
      summaryText: "No recent transactions available.",
      stats: null
    };
  }

  const totalSpent = transactions.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  );

  const byCategory = {};

  for (const tx of transactions) {
    const cat = tx.category_primary || "Uncategorized";
    byCategory[cat] = (byCategory[cat] || 0) + Number(tx.amount);
  }

  const categoryLines = Object.entries(byCategory)
    .map(([cat, amt]) => `${cat}: $${amt.toFixed(2)}`)
    .join("\n");

  return {
    summaryText: `
Total Spent (last ${transactions.length} transactions): $${totalSpent.toFixed(2)}

Spending by Category:
${categoryLines}
`,
    stats: {
      totalSpent,
      byCategory
    }
  };
}