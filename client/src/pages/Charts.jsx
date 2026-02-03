import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { API_BASE } from "../config/apiBase";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Reports() {
  const [month, setMonth] = useState("2025-01");
  const [daily, setDaily] = useState([]);
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE}/api/reports/monthly?month=${month}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDaily(data.daily || []);
        setCategories(data.categories || []);
      })
      .catch(console.error);
  }, [month, token]);


  const dailyChart = {
    labels: daily.map((d) => d.day),
    datasets: [
      {
        label: "Daily Spending ($)",
        data: daily.map((d) => d.total),
        backgroundColor: "#1B4D3E",
      },
    ],
  };


  const categoryChart = {
    labels: categories.map((c) => c.category || "Other"),
    datasets: [
      {
        data: categories.map((c) => c.total),
        backgroundColor: [
          "#1B4D3E",
          "#4CAF50",
          "#FFC107",
          "#FF5722",
          "#9C27B0",
        ],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-wisegreen mb-4">
        Monthly Spending Report
      </h1>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border px-3 py-2 rounded mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-3">Daily Spending</h2>
          <Bar data={dailyChart} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-3">Spending by Category</h2>
          <Pie data={categoryChart} />
        </div>
      </div>
    </div>
  );
}
