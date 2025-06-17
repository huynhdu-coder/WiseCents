import React, { useState } from 'react';

const CATEGORIES = [
  'Salary',
  'Food & Dining',
  'Housing',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Other'
];

function TransactionForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    const finalData = {
      ...formData,
      amount: formData.type === 'expense' ? -Math.abs(amount) : Math.abs(amount)
    };
    onSubmit(finalData);
    if (!initialData) {
      setFormData({
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          type="text"
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          name="category"
          id="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          name="date"
          id="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <div className="mt-2 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleChange}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
            <span className="ml-2">Expense</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleChange}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
            <span className="ml-2">Income</span>
          </label>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {initialData ? 'Update Transaction' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm; 