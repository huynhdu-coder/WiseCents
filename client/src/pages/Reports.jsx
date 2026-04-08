import { useEffect, useState } from "react";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import MonthlyBarChart from "../components/charts/MonthlyBarChart";
import TransactionsPanel from "../components/charts/TransactionsPanel";
import FinancialAuditCard from "../components/charts/FinancialAuditCard";
import PageHeader from "../components/layout/PageHeader";

const API_BASE =
  process.env.REACT_APP_BACKEND || "http://localhost:5000";

export default function Reports() {
  const [filters, setFilters] = useState({
    dateRange: "90",
    account: "all",
    category: "all",
  });

  const [page, setPage] = useState(1);
  const [audit, setAudit] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 20;
  const token = localStorage.getItem("token");

//Fetch financial audit on load
  useEffect(() => {
    if (!token) return;

    const params = new URLSearchParams(filters).toString();

    fetch(`${API_BASE}/api/reports/financial-audit?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setAudit)
      .catch(console.error);
  }, [token, filters]);

//Fetch transactions when filters or page changes
  useEffect(() => {
    if (!token) return;

    const params = new URLSearchParams({
      ...filters,
      page,
      limit,
    }).toString();

    fetch(`${API_BASE}/api/reports/transactions?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTransactions(data);
          setTotalPages(1);
        } else {
          setTransactions(data.transactions || []);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch(console.error);
  }, [token, filters, page]);

  //Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Reports"
        subtitle="Analyze your spending patterns and get insights to optimize your finances."
        right={
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-app-muted">
              Filters
            </span>

            <select
              value={filters.dateRange}
              onChange={(e) =>
                setFilters({ ...filters, dateRange: e.target.value })
              }
              className="appearance-none rounded-xl border border-app-border bg-app-surface px-3 py-2 text-sm text-app-text outline-none focus:border-app-primary"
            >
              <option value="30">Last 30D</option>
              <option value="90">Last 90D</option>
              <option value="365">Last 365D</option>
            </select>

            <select
              value={filters.account}
              onChange={(e) =>
                setFilters({ ...filters, account: e.target.value })
              }
              className="appearance-none rounded-xl border border-app-border bg-app-surface px-3 py-2 text-sm text-app-text outline-none focus:border-app-primary"
            >
              <option value="all">All Accounts</option>
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="min-w-[150px] appearance-none rounded-xl border border-app-border bg-app-surface px-3 py-2 text-sm text-app-text outline-none focus:border-app-primary"
            >
              <option value="all">All Categories</option>
              <option value="Food">Food</option>
              <option value="Groceries">Groceries</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Transportation">Transportation</option>
              <option value="Health">Health</option>
              <option value="Home">Home</option>
            </select>
          </div>
        }
      />

      {/* Transactions + Audit */}
      <div className="grid grid-cols-10 gap-4">
        <TransactionsPanel
          transactions={transactions}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />

        <FinancialAuditCard audit={audit} />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <CategoryPieChart filters={filters} />
        <MonthlyBarChart filters={filters} />
      </div>
    </div>
  );
}