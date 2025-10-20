import React from 'react';
import { Line } from 'react-chartjs-2';

function Dashboard() {
  // Placeholder data 
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [3000, 3500, 3200, 3800, 3600, 4000],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Expenses',
        data: [2500, 2800, 2600, 3000, 2900, 3200],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Balance</h3>
          <p className="text-3xl font-bold text-green-600">$5,240</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Monthly Income</h3>
          <p className="text-3xl font-bold text-blue-600">$4,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Monthly Expenses</h3>
          <p className="text-3xl font-bold text-red-600">$3,200</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Income vs Expenses</h3>
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default Dashboard; 