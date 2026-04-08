import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../../config/apiBase";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function formatMonthLabel(monthKey) {
  if (!monthKey) return "";
  const [year, month] = String(monthKey).split("-");
  if (!year || !month) return monthKey;

  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

function getThemeColors() {
  const styles = getComputedStyle(document.documentElement);
  const text = styles.getPropertyValue("--text").trim();
  const muted = styles.getPropertyValue("--text-muted").trim();
  const border = styles.getPropertyValue("--border").trim();

  return {
    text: text ? `rgb(${text})` : "#0f172a",
    muted: muted ? `rgb(${muted})` : "#64748b",
    border: border ? `rgb(${border})` : "#cbd5e1",
    income: "#10b981",
    expenses: "#ef4444",
    net: "#3b82f6",
  };
}

export default function MonthlyBarChart({ filters }) {
  const [data, setData] = useState({});
  const [themeTick, setThemeTick] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const params = new URLSearchParams({
      dateRange: filters?.dateRange || "90",
      account: filters?.account || "all",
      category: filters?.category || "all",
    }).toString();

    fetch(`${API_BASE}/api/reports/monthly-report?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setData(json || {}))
      .catch(console.error);
  }, [token, filters]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeTick((prev) => prev + 1);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const theme = useMemo(() => getThemeColors(), [themeTick]);

  const months = useMemo(() => Object.keys(data || {}).sort(), [data]);

  const chartData = useMemo(
    () => ({
      labels: months.map(formatMonthLabel),
      datasets: [
        {
          label: "Income",
          data: months.map((m) => Number(data[m]?.income || 0)),
          backgroundColor: theme.income,
          borderRadius: 8,
        },
        {
          label: "Expenses",
          data: months.map((m) => Number(data[m]?.expenses || 0)),
          backgroundColor: theme.expenses,
          borderRadius: 8,
        },
        {
          label: "Net Cashflow",
          data: months.map((m) => Number(data[m]?.net || 0)),
          backgroundColor: theme.net,
          borderRadius: 8,
        },
      ],
    }),
    [months, data, theme]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: theme.text,
            boxWidth: 12,
            boxHeight: 12,
            useBorderRadius: true,
            borderRadius: 4,
            padding: 16,
            font: {
              size: 13,
              weight: "600",
            },
          },
        },
        tooltip: {
          backgroundColor: "#111827",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: theme.border,
          borderWidth: 1,
          callbacks: {
            label(context) {
              const value = Number(context.parsed.y || 0);
              return `${context.dataset.label}: $${value.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: theme.muted,
            font: {
              size: 12,
            },
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: theme.muted,
            font: {
              size: 12,
            },
            callback(value) {
              return `$${Number(value).toLocaleString()}`;
            },
          },
          grid: {
            color: `${theme.border}66`,
          },
          border: {
            display: false,
          },
        },
      },
    }),
    [theme]
  );

  return (
    <div className="rounded-[24px] border border-app-border bg-app-surface p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-app-text sm:text-2xl">Monthly Trend</h2>
        <p className="mt-1 text-sm text-app-muted">
          Income, expenses, and net cashflow by month
        </p>
      </div>

      <div className="h-[320px] rounded-[20px] bg-app-soft p-4">
        <Bar key={themeTick} options={options} data={chartData} />
      </div>
    </div>
  );
}