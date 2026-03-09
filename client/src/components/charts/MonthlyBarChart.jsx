import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { API_BASE } from "../../config/apiBase";

export default function MonthlyBarChart() {
  const [data, setData] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE}/api/reports/monthly-report`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [token]);

  const months = Object.keys(data);

const chartData = {
  labels: months,
  datasets: [
    {
      label: "Income",
      data: months.map(m => data[m]?.income || 0),
      backgroundColor: "#10b981",
    },
    {
      label: "Expenses",
      data: months.map(m => data[m]?.expenses || 0),
      backgroundColor: "#ef4444",
    },
    {
      label: "Net Cashflow",
      data: months.map(m => data[m]?.net || 0),
      backgroundColor: "#065f46",
    },
  ],
};

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Monthly Trend
      </h2>
      <Bar options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
            }
          }}
       data={chartData} />
    </div>
  );
}
