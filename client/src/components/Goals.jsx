import React, { useState } from 'react';

function Goals() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Emergency Fund',
      target: 10000,
      current: 5000,
      deadline: '2024-12-31'
    },
    {
      id: 2,
      name: 'New Car',
      target: 25000,
      current: 8000,
      deadline: '2025-06-30'
    }
  ]);

  const calculateProgress = (current, target) => {
    return (current / target) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add Goal
        </button>
      </div>

      {/* Goals List */}
      <div className="grid gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{goal.name}</h3>
                <p className="text-sm text-gray-500">Target: ${goal.target.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-blue-600">
                  ${goal.current.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Current</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${calculateProgress(goal.current, goal.target)}%` }}
              ></div>
            </div>
            
            <div className="mt-2 flex justify-between text-sm text-gray-500">
              <span>{calculateProgress(goal.current, goal.target).toFixed(1)}% Complete</span>
              <span>Target: {goal.deadline}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Goals; 