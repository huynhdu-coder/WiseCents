import { ClipboardCheck, DollarSign, Landmark, Goal } from "lucide-react";
import StatCard from "./StatCard";

export default function StatsGrid({
  totalBalance = 0,
  linkedAccounts = 0,
  activeGoals = 0,
  goalCompletion = 0,
}) {
  const formattedBalance = `$${Number(totalBalance || 0).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;

  return (
    <section className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total Balance" value={formattedBalance} icon={DollarSign} />
      <StatCard title="Linked Accounts" value={linkedAccounts} icon={Landmark} />
      <StatCard title="Active Goals" value={activeGoals} icon={Goal} />
      <StatCard title="Goal Completion" value={`${goalCompletion}%`} icon={ClipboardCheck} />
    </section>
  );
}