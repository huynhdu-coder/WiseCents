import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Wallet,
  TrendingUp,
  Landmark,
  Repeat,
  ArrowUpRight,
  Activity,
  BarChart3,
} from "lucide-react";

import StatCard from "../components/investments/StatCard";
import SectionCard from "../components/investments/SectionCard";
import Watchlist from "../components/investments/Watchlist";
import HoldingsTable from "../components/investments/HoldingsTable";
import PositionCards from "../components/investments/PositionCards";
import StockOverview from "../components/investments/StockOverview";
import TradePanel from "../components/investments/TradePanel";
import TransferPanel from "../components/investments/TransferPanel";

import { formatCurrency } from "../utils/investmentFormatters";
import {
  ensurePaperAccount,
  getPortfolio,
  getQuote,
  transferFunds,
  buyStock,
  sellStock,
  createRecurringBuy,
} from "../api/investmentsApi";

export default function InvestmentsPage() {
  const [portfolio, setPortfolio] = useState(null);
  const [quote, setQuote] = useState(null);
  const [symbol, setSymbol] = useState("AAPL");
  const [search, setSearch] = useState("");
  const [dollarAmount, setDollarAmount] = useState(100);
  const [transferAmount, setTransferAmount] = useState(500);
  const [recurringAmount, setRecurringAmount] = useState(100);
  const [frequency, setFrequency] = useState("WEEKLY");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData(selected = symbol) {
    const token = localStorage.getItem("token");
    if (!token) return;

    const [portfolioData, quoteData] = await Promise.all([
      getPortfolio(),
      getQuote(selected),
    ]);

    setPortfolio(portfolioData);
    setQuote(quoteData);
  }

  async function refreshQuoteOnly(selected = symbol) {
    const token = localStorage.getItem("token");
    if (!token) return;

    const quoteData = await getQuote(selected);
    setQuote(quoteData);
  }

  async function handleTransfer() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      await transferFunds(transferAmount);
      setMessage("Funds transferred successfully.");
      await loadData(symbol);
    } catch (err) {
      setError(err?.response?.data?.error || "Transfer failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleBuy() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      await buyStock({
        symbol,
        dollarAmount,
      });

      setMessage(`Bought ${symbol}.`);
      await loadData(symbol);
    } catch (err) {
      setError(err?.response?.data?.error || "Buy failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSell() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      await sellStock({
        symbol,
        dollarAmount,
      });

      setMessage(`Sold ${symbol}.`);
      await loadData(symbol);
    } catch (err) {
      setError(err?.response?.data?.error || "Sell failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateRecurring() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      await createRecurringBuy({
        symbol,
        dollarAmount: recurringAmount,
        frequency,
      });

      setMessage("Recurring buy created.");
      await loadData(symbol);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create recurring buy");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setLoading(true);
        await ensurePaperAccount();
        await loadData(symbol);
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to load investments page.");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  // Refresh quote immediately when selected symbol changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    refreshQuoteOnly(symbol).catch((err) => {
      setError(err?.response?.data?.error || "Failed to refresh selected symbol.");
    });
  }, [symbol]);

  // Background refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const interval = setInterval(() => {
      loadData(symbol).catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, [symbol]);

  const positions = portfolio?.positions || [];

  const quickSymbols = useMemo(() => {
    const defaults = [
      { symbol: "AAPL" },
      { symbol: "MSFT" },
      { symbol: "NVDA" },
      { symbol: "AMZN" },
      { symbol: "GOOGL" },
      { symbol: "TSLA" },
      { symbol: "META" },
    ];

    const map = new Map();

    defaults.forEach((item) => {
      map.set(item.symbol, {
        symbol: item.symbol,
        currentPrice: item.symbol === symbol ? quote?.currentPrice || 0 : 0,
        percentGainLoss: 0,
      });
    });

    positions.forEach((item) => {
      map.set(item.symbol, {
        ...map.get(item.symbol),
        ...item,
      });
    });

    if (!map.has(symbol)) {
      map.set(symbol, {
        symbol,
        currentPrice: quote?.currentPrice || 0,
        percentGainLoss: 0,
      });
    } else if (!map.get(symbol)?.quantity) {
      map.set(symbol, {
        ...map.get(symbol),
        currentPrice: quote?.currentPrice || 0,
      });
    }

    return Array.from(map.values());
  }, [positions, symbol, quote]);

  const filteredSymbols = useMemo(() => {
    if (!search.trim()) return quickSymbols;
    return quickSymbols.filter((item) =>
      item.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }, [quickSymbols, search]);

  const summary = {
    cashBalance: Number(portfolio?.cashBalance || 0),
    startingBalance: Number(portfolio?.startingBalance || 0),
    investedValue: Number(portfolio?.investedValue || 0),
    totalValue: Number(portfolio?.totalValue || 0),
    totalGainLoss:
      Number(portfolio?.totalValue || 0) - Number(portfolio?.startingBalance || 0),
  };

  const bestPerformer = [...positions].sort(
    (a, b) => Number(b.percentGainLoss || 0) - Number(a.percentGainLoss || 0)
  )[0];

  if (!portfolio && loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Paper Investing
        </h1>
        <p className="mt-2 text-slate-500">
          Transfer virtual cash, buy stocks, and track your portfolio performance.
        </p>
      </div>

      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Investment Cash"
          value={formatCurrency(summary.cashBalance)}
          subtitle="Available to trade"
          icon={Wallet}
        />
        <StatCard
          title="Total Funded"
          value={formatCurrency(summary.startingBalance)}
          subtitle="Cash transferred in"
          icon={Landmark}
        />
        <StatCard
          title="Invested Value"
          value={formatCurrency(summary.investedValue)}
          subtitle="Current market value"
          icon={TrendingUp}
        />
        <StatCard
          title="Total Value"
          value={formatCurrency(summary.totalValue)}
          subtitle={`${formatCurrency(summary.totalGainLoss)} total return`}
          icon={Repeat}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <SectionCard
            title="Watchlist / Symbols"
            right={<BarChart3 className="h-4 w-4 text-slate-400" />}
          >
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search symbol"
                className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-slate-400"
              />
            </div>

            <Watchlist
              items={filteredSymbols}
              selectedSymbol={symbol}
              onSelect={setSymbol}
            />
          </SectionCard>

          <TransferPanel
            transferAmount={transferAmount}
            setTransferAmount={setTransferAmount}
            loading={loading}
            onTransfer={handleTransfer}
          />

          <SectionCard
            title="Quick Stats"
            right={<Activity className="h-4 w-4 text-slate-400" />}
          >
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-slate-500">Positions</span>
                <span className="font-medium text-slate-900">{positions.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-slate-500">Selected Symbol</span>
                <span className="font-medium text-slate-900">{symbol}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-slate-500">Best Performer</span>
                <span className="font-medium text-slate-900">
                  {bestPerformer?.symbol || "-"}
                </span>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <StockOverview symbol={symbol} quote={quote} />

          <SectionCard
            title="Positions Table"
            right={<ArrowUpRight className="h-4 w-4 text-slate-400" />}
          >
            <HoldingsTable holdings={positions} onSelect={setSymbol} />
          </SectionCard>

          <SectionCard
            title="Position Cards"
            right={<ArrowUpRight className="h-4 w-4 text-slate-400" />}
          >
            <PositionCards holdings={positions} onSelect={setSymbol} />
          </SectionCard>
        </div>

        <div className="xl:sticky xl:top-6 xl:self-start">
          <TradePanel
            selectedSymbol={symbol}
            quote={quote}
            cashBalance={summary.cashBalance}
            dollarAmount={dollarAmount}
            setDollarAmount={setDollarAmount}
            recurringAmount={recurringAmount}
            setRecurringAmount={setRecurringAmount}
            frequency={frequency}
            setFrequency={setFrequency}
            loading={loading}
            onBuy={handleBuy}
            onSell={handleSell}
            onCreateRecurring={handleCreateRecurring}
            onRefresh={() => loadData(symbol)}
          />
        </div>
      </div>
    </div>
  );
}