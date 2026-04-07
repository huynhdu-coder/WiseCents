import GoalSection from "../goals/GoalSection";

export default function GoalPanel({
  goals = [],
  fetchGoals,
  onAddGoal,
}) {
  const activeGoals = goals.filter((goal) => {
    const current = Number(goal.current_amount || 0);
    const target = Number(goal.target_amount || 0);
    return target > 0 && current < target;
  }).length;

  return (
    <section className="rounded-xl2 border border-app-border bg-app-surface p-4 shadow-card sm:p-5">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-app-text sm:text-2xl">
            Goals
          </h2>
          <p className="mt-1 text-sm text-app-muted">
            Track and manage your savings goals
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-app-soft px-3 py-1 text-xs font-semibold text-app-muted">
            {activeGoals} active
          </span>

          <button
            type="button"
            onClick={onAddGoal}
            className="rounded-full bg-app-primary px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-app-primaryHover"
          >
            + Add Goal
          </button>
        </div>
      </div>

      <GoalSection goals={goals} refreshGoals={fetchGoals} />
    </section>
  );
}