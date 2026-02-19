import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { API_BASE } from "../../config/apiBase";

export default function CategoryPieChart() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE}/api/reports/spending-by-category`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [token]);
  
    if (!Array.isArray(data) || data.length === 0) {
      return (
        <div className="bg-white p-6 rounded-xl shadow h-[400px] flex items-center justify-center">
          <p className="text-gray-500">No transaction data available</p>
        </div>
      );
    }


  const chartData = {
  labels: data.map(d => d.category || "Other"),
  datasets: [
    {
      data: data.map(d => d.total),
      backgroundColor: [
        "#065f46",
        "#047857",
        "#10b981",
        "#34d399",
        "#6ee7b7"
      ],
    },
  ],
};


  return (
  <div className="bg-white p-6 rounded-xl shadow h-[400px]">
    <h2 className="text-lg font-semibold mb-4">
      Spending by Category
    </h2>

    <div className="h-[300px]">
      <Pie data={chartData} options={{ maintainAspectRatio: false }} />
    </div>
  </div>
  );
}
