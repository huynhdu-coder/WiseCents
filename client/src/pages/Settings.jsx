import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Settings() {
  const [preferences, setPreferences] = useState({
    primary_intent: 'general_budgeting',
    advice_style: 'balanced',
    change_tolerance: 'moderate'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/user/profile')
      .then(res => {
        setPreferences({
          primary_intent: res.data.primary_intent,
          advice_style: res.data.advice_style,
          change_tolerance: res.data.change_tolerance
        });
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.put('/user/preferences', preferences);
      setMessage('✅ Preferences saved successfully!');
    } catch (err) {
      setMessage('❌ Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-wisegreen mb-4">User Settings</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            What's your primary financial goal?
          </label>
          <select
            value={preferences.primary_intent}
            onChange={(e) => setPreferences({...preferences, primary_intent: e.target.value})}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="save_more">Save More Money</option>
            <option value="reduce_debt">Reduce Debt</option>
            <option value="investment_planning">Investment Planning</option>
            <option value="expense_tracking">Track Expenses</option>
            <option value="general_budgeting">General Budgeting</option>
            <option value="retirement_planning">Retirement Planning</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            How should the AI advisor communicate?
          </label>
          <select
            value={preferences.advice_style}
            onChange={(e) => setPreferences({...preferences, advice_style: e.target.value})}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="motivational">Motivational & Encouraging</option>
            <option value="balanced">Balanced (Default)</option>
            <option value="analytical">Analytical & Data-Driven</option>
            <option value="strict">Strict & Direct</option>
            <option value="casual">Casual & Friendly</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            How aggressive should budget recommendations be?
          </label>
          <select
            value={preferences.change_tolerance}
            onChange={(e) => setPreferences({...preferences, change_tolerance: e.target.value})}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="conservative">Conservative - Small, gradual changes</option>
            <option value="moderate">Moderate - Balanced approach</option>
            <option value="aggressive">Aggressive - Significant changes</option>
            <option value="very_aggressive">Very Aggressive - Maximum savings</option>
          </select>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-wisegreen text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>
    </div>
  );
}