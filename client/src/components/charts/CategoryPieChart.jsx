import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { API_BASE } from "../../config/apiBase";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPieChart() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE}/api/reports/spending-by-category`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, [token]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <section className="rounded-xl2 border border-app-border bg-app-surface p-4 shadow-card sm:p-5">
        <div className="flex h-[260px] items-center justify-center rounded-xl2 bg-app-soft">
          <p className="text-sm text-app-muted">No transaction data available</p>
        </div>
      </section>
    );
  }

  const chartData = {
    labels: data.map((d) => d.category || "Other"),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: [
          "#065f46",
          "#047857",
          "#10b981",
          "#34d399",
          "#6ee7b7",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <section className="rounded-xl2 border border-app-border bg-app-surface p-4 shadow-card sm:p-5">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-app-text sm:text-2xl">
          Spending by Category
        </h2>
        <p className="mt-1 text-sm text-app-muted">
          Breakdown of your spending across categories
        </p>
      </div>

      <div className="h-[260px] rounded-xl2 bg-app-soft p-3 sm:h-[300px] sm:p-4">
        <Pie data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
    </section>
  );
}