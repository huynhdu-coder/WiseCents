import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { API_BASE } from "../../config/apiBase";

export default function MonthlyBarChart() {
  const [data, setData] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE}/api/reports/monthly-trend`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [token]);

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Monthly Spending",
        data: Object.values(data),
        backgroundColor: "#065f46",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Monthly Trend
      </h2>
      <Bar data={chartData} />
    </div>
  );
}
