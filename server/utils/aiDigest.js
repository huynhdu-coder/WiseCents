function toNumber(value) {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
}

function toIsoDate(value) {
  if (!value) return null;
  try {
    return new Date(value).toISOString();
  } catch {
    return null;
  }
}

function safeAccountName(account) {
  if (!account) return null;
  return account.nickname || account.name || account.official_name || "Unnamed account";
}

export function buildAIContext({
  user,
  accounts = [],
  goals = [],
  transactions = [],
  paperAccount = null,
  paperPositions = [],
  paperOrders = [],
  portfolioSnapshots = [],
  investmentTransfers = [],
  recurringBuys = [],
  subscriptions = null,
}) {
  const spendingByCategory = {};
  let totalRecentSpent = 0;

  for (const tx of transactions) {
    const amount = toNumber(tx.amount) || 0;
    const category = tx.category_primary || "Uncategorized";

    spendingByCategory[category] = (spendingByCategory[category] || 0) + amount;
    totalRecentSpent += amount;
  }

  const totalBankBalance = accounts.reduce((sum, acc) => {
    return sum + (toNumber(acc.current_balance) || 0);
  }, 0);

  const totalGoalTarget = goals.reduce((sum, goal) => {
    return sum + (toNumber(goal.target_amount) || 0);
  }, 0);

  const totalGoalCurrent = goals.reduce((sum, goal) => {
    return sum + (toNumber(goal.current_amount) || 0);
  }, 0);

  const latestSnapshot = portfolioSnapshots.length > 0 ? portfolioSnapshots[0] : null;

  const topSpendingCategories = Object.entries(spendingByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, amount]) => ({
      category,
      amount: Number(amount.toFixed(2)),
    }));

  return {
    consentGranted: true,

    profile: {
      firstName: user.first_name ?? null,
      lastName: user.last_name ?? null,
      email: user.email ?? null,
      adviceStyle: user.advice_style ?? null,
      changeTolerance: user.change_tolerance ?? null,
      primaryIntent: user.primary_intent ?? null,
    },

    subscription: subscriptions
      ? {
          subscriptionType: subscriptions.subscription_type ?? "free",
          subscriptionStatus: subscriptions.subscription_status ?? "trial",
          trialStart: toIsoDate(subscriptions.trial_start),
          trialEnd: toIsoDate(subscriptions.trial_end),
          studentVerified: Boolean(subscriptions.student_verified),
          studentDiscountActive: Boolean(subscriptions.student_discount_active),
          studentEmail: subscriptions.student_email ?? null,
          studentVerifiedAt: toIsoDate(subscriptions.student_verified_at),
          studentDiscountPercent: subscriptions.student_discount_percent ?? 0,
        }
      : null,

    accounts: accounts.map((acc) => ({
      id: acc.account_id,
      name: safeAccountName(acc),
      officialName: acc.official_name ?? null,
      type: acc.type ?? null,
      subtype: acc.subtype ?? null,
      currentBalance: toNumber(acc.current_balance),
      availableBalance: toNumber(acc.available_balance),
      isHidden: Boolean(acc.is_hidden),
      createdAt: toIsoDate(acc.created_at),
    })),

    goals: goals.map((goal) => ({
      id: goal.goal_id,
      name: goal.name,
      targetAmount: toNumber(goal.target_amount),
      currentAmount: toNumber(goal.current_amount),
      deadline: toIsoDate(goal.deadline),
      recurringAmount: toNumber(goal.recurring_amount),
      recurringFrequency: goal.recurring_frequency ?? null,
      lastRecurringDate: toIsoDate(goal.last_recurring_date),
      fundingAccountId: goal.funding_account_id ?? null,
    })),

    transactions: transactions.map((tx) => ({
      id: tx.transaction_id,
      name: tx.name,
      amount: toNumber(tx.amount),
      date: toIsoDate(tx.date),
      categoryPrimary: tx.category_primary ?? null,
      categoryDetailed: tx.category_detailed ?? null,
      accountId: tx.account_id,
      accountName: tx.bank_accounts ? safeAccountName(tx.bank_accounts) : null,
    })),

    investments: {
      paperAccount: paperAccount
        ? {
            paperAccountId: paperAccount.paper_account_id,
            cashBalance: toNumber(paperAccount.cash_balance),
            startingBalance: toNumber(paperAccount.starting_balance),
            createdAt: toIsoDate(paperAccount.created_at),
            updatedAt: toIsoDate(paperAccount.updated_at),
          }
        : null,

      positions: paperPositions.map((pos) => ({
        symbol: pos.investment_assets?.symbol ?? null,
        name: pos.investment_assets?.name ?? null,
        quantity: toNumber(pos.quantity),
        avgCost: toNumber(pos.avg_cost),
        totalCost: toNumber(pos.total_cost),
        updatedAt: toIsoDate(pos.updated_at),
      })),

      recentOrders: paperOrders.map((order) => ({
        symbol: order.investment_assets?.symbol ?? null,
        name: order.investment_assets?.name ?? null,
        side: order.side,
        status: order.status,
        dollarAmount: toNumber(order.dollar_amount),
        quantity: toNumber(order.quantity),
        price: toNumber(order.price),
        executedAt: toIsoDate(order.executed_at),
      })),

      recentSnapshots: portfolioSnapshots.map((snap) => ({
        totalValue: toNumber(snap.total_value),
        cashBalance: toNumber(snap.cash_balance),
        investedValue: toNumber(snap.invested_value),
        createdAt: toIsoDate(snap.created_at),
      })),

      transfers: investmentTransfers.map((transfer) => ({
        amount: toNumber(transfer.amount),
        createdAt: toIsoDate(transfer.created_at),
        fromAccount:
          transfer.bank_accounts?.nickname ||
          transfer.bank_accounts?.name ||
          transfer.bank_accounts?.official_name ||
          null,
      })),

      recurringBuys: recurringBuys.map((buy) => ({
        symbol: buy.investment_assets?.symbol ?? null,
        name: buy.investment_assets?.name ?? null,
        dollarAmount: toNumber(buy.dollar_amount),
        frequency: buy.frequency,
        nextRunAt: toIsoDate(buy.next_run_at),
        lastRunAt: toIsoDate(buy.last_run_at),
        isActive: Boolean(buy.is_active),
      })),
    },

    summaries: {
      accountCount: accounts.length,
      goalCount: goals.length,
      transactionCount: transactions.length,
      totalBankBalance: Number(totalBankBalance.toFixed(2)),
      totalGoalTarget: Number(totalGoalTarget.toFixed(2)),
      totalGoalCurrent: Number(totalGoalCurrent.toFixed(2)),
      totalRecentSpent: Number(totalRecentSpent.toFixed(2)),
      topSpendingCategories,
      latestPortfolioValue: latestSnapshot ? toNumber(latestSnapshot.total_value) : null,
      latestPortfolioCash: latestSnapshot ? toNumber(latestSnapshot.cash_balance) : null,
      latestPortfolioInvested: latestSnapshot ? toNumber(latestSnapshot.invested_value) : null,
    },
  };
}