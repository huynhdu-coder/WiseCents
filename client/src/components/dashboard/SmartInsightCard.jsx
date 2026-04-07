function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function getMoneyMood(latest, previous) {
  const income = Number(latest?.income || 0);
  const expenses = Number(latest?.expenses || 0);
  const net = Number(latest?.net || income - expenses);

  const prevExpenses = Number(previous?.expenses || 0);
  const expenseChange = expenses - prevExpenses;

  if (net > 0 && expenseChange <= 0) {
    return {
      mood: "Growing",
      emoji: "🌱",
      tone: "text-emerald-600",
      bg: "bg-emerald-50",
    };
  }

  if (net > 0 && expenseChange > 0) {
    return {
      mood: "Cautious",
      emoji: "🧐",
      tone: "text-amber-600",
      bg: "bg-amber-50",
    };
  }

  if (net < 0) {
    return {
      mood: "Overspending",
      emoji: "🚨",
      tone: "text-red-600",
      bg: "bg-red-50",
    };
  }

  return {
    mood: "Stable",
    emoji: "🦉",
    tone: "text-app-primary",
    bg: "bg-app-primarySoft",
  };
}

function buildInsight(monthlyData = [], goals = []) {
  if (!monthlyData.length) {
    return {
      title: "Your WiseCents assistant is getting ready.",
      message:
        "Once more monthly data is available, this card will highlight spending habits, momentum, and smart next steps.",
      action: "Keep syncing accounts and reviewing reports.",
      mood: {
        mood: "Stable",
        emoji: "🦉",
        tone: "text-app-primary",
        bg: "bg-app-primarySoft",
      },
      chips: [],
    };
  }

  const latest = monthlyData[monthlyData.length - 1];
  const previous = monthlyData[monthlyData.length - 2] || null;

  const income = Number(latest?.income || 0);
  const expenses = Number(latest?.expenses || 0);
  const net = Number(latest?.net ?? income - expenses);

  const prevExpenses = Number(previous?.expenses || 0);
  const prevNet = Number(previous?.net ?? 0);

  const expenseDiff = expenses - prevExpenses;
  const netDiff = net - prevNet;

  const activeGoals = goals.filter((goal) => {
    const current = Number(goal.current_amount || 0);
    const target = Number(goal.target_amount || 0);
    return target > 0 && current < target;
  });

  const closestGoal = activeGoals
    .map((goal) => {
      const current = Number(goal.current_amount || 0);
      const target = Number(goal.target_amount || 0);
      const pct = target > 0 ? current / target : 0;
      return { ...goal, pct };
    })
    .sort((a, b) => b.pct - a.pct)[0];

  let title = "Your finances are looking steady.";
  let message =
    "This month looks balanced overall, with no major change from the previous month.";
  let action = "Keep monitoring your monthly cashflow and maintain consistency.";

  if (net > 0 && expenseDiff < 0) {
    title = "You created stronger breathing room this month.";
    message = `Expenses dropped by ${formatCurrency(
      Math.abs(expenseDiff)
    )}, while you stayed cashflow-positive.`;
    action =
      "Good time to move extra cash toward savings or one of your active goals.";
  } else if (net > 0 && expenseDiff > 0) {
    title = "You are still positive, but spending is climbing.";
    message = `Expenses increased by ${formatCurrency(
      expenseDiff
    )} compared to last month.`;
    action =
      "Review your top categories in Reports before the increase becomes a habit.";
  } else if (net < 0) {
    title = "Your spending outpaced your income this month.";
    message = `Net cashflow is ${formatCurrency(
      net
    )}. This may be a month to slow down flexible spending.`;
    action =
      "Focus on one category to trim and aim to return to positive cashflow next month.";
  } else if (netDiff > 0) {
    title = "You are moving in the right direction.";
    message = `Net cashflow improved by ${formatCurrency(
      netDiff
    )} compared to last month.`;
    action = "Keep repeating what worked this month.";
  }

  if (closestGoal) {
    const target = Number(closestGoal.target_amount || 0);
    const current = Number(closestGoal.current_amount || 0);
    const left = Math.max(target - current, 0);

    action = `${closestGoal.name} is your closest goal. Only ${formatCurrency(
      left
    )} left to complete it.`;
  }

  const mood = getMoneyMood(latest, previous);

  const chips = [
    latest?.month ? `Month: ${latest.month}` : null,
    `Net: ${formatCurrency(net)}`,
    `Expenses: ${formatCurrency(expenses)}`,
    activeGoals.length ? `${activeGoals.length} active goal(s)` : "No active goals",
  ].filter(Boolean);

  return { title, message, action, mood, chips };
}

export default function SmartInsightCard({ monthlyData = [], goals = [] }) {
  const insight = buildInsight(monthlyData, goals);

  return (
    <section className="rounded-xl2 border border-app-border bg-app-surface p-4 shadow-card sm:p-5">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-app-text sm:text-2xl">
            Smart Insight
          </h2>
          <p className="mt-1 text-sm text-app-muted">
            A quick read on your money habits
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${insight.mood.bg} ${insight.mood.tone}`}
        >
          <span>{insight.mood.emoji}</span>
          <span className="truncate">{insight.mood.mood}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-xl2 bg-app-soft p-4 sm:p-5">
        <p className="text-base font-semibold text-app-text sm:text-lg">
          {insight.title}
        </p>

        <p className="mt-2 text-sm leading-normal text-app-muted">
          {insight.message}
        </p>

        {/* Action Box */}
        <div className="mt-4 rounded-xl2 border border-app-border bg-app-surface p-3.5 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-app-muted">
            Suggested next move
          </p>
          <p className="mt-1.5 text-sm font-medium leading-normal text-app-text">
            {insight.action}
          </p>
        </div>

        {/* Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {insight.chips.map((chip) => (
            <span
              key={chip}
              className="max-w-[140px] truncate rounded-full border border-app-border bg-app-surface px-2.5 py-1 text-xs font-medium text-app-muted"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}