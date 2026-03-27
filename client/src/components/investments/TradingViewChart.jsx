import { useEffect, useRef } from "react";

export default function TradingViewChart({ symbol = "NASDAQ:AAPL" }) {
  const widgetRef = useRef(null);

  useEffect(() => {
  if (!widgetRef.current) return;

  const container = widgetRef.current;
  container.innerHTML = "";

  const timeout = setTimeout(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "D",
      timezone: "America/New_York",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    container.appendChild(script);
  }, 0);

  return () => clearTimeout(timeout);
}, [symbol]);

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-2xl border border-slate-800">
      <div className="tradingview-widget-container h-full w-full">
        <div
          ref={widgetRef}
          className="tradingview-widget-container__widget h-full w-full"
        />
      </div>
    </div>
  );
}