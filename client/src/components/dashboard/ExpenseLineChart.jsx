import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../../config/apiBase";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function formatMonthLabel(monthKey) {
  if (!monthKey) return "";
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  return date.toLocaleString("en-US", {
    month: "short",
  });
}

export default function ExpenseLineChart() {
  const [monthlyData, setMonthlyData] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE}/api/reports/monthly-report`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMonthlyData(data || {}))
      .catch(console.error);
  }, [token]);

  const months = useMemo(() => {
    return Object.keys(monthlyData || {}).sort();
  }, [monthlyData]);

  const chartData = {
    labels: months.map(formatMonthLabel),
    datasets: [
      {
        label: "Expenses",
        data: months.map((month) => Number(monthlyData[month]?.expenses || 0)),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.35,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = Number(context.parsed.y || 0);
            return `Expenses: $${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b",
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#64748b",
          callback: function (value) {
            return `$${Number(value).toLocaleString()}`;
          },
        },
        grid: {
          color: "rgba(148, 163, 184, 0.15)",
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <section className="rounded-xl2 border border-app-border bg-app-surface p-4 shadow-card sm:p-5">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-app-text sm:text-2xl">
          Monthly Expenses
        </h2>
        <p className="mt-1 text-sm text-app-muted">
          Total expenses across each month
        </p>
      </div>

      <div className="h-[240px] rounded-xl2 bg-app-soft p-3 sm:h-[260px] sm:p-4">
        <Line data={chartData} options={options} />
      </div>
    </section>
  );
}