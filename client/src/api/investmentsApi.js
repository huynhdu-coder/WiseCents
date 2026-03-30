import axios from "../api/axios";

export async function ensurePaperAccount() {
  const { data } = await axios.post("/investments/paper-account");
  return data;
}

export async function getPortfolio() {
  const { data } = await axios.get("/investments/portfolio");
  return data;
}

export async function getQuote(symbol) {
  const { data } = await axios.get(`/investments/quote/${symbol}`);
  return data;
}

export async function getHistory(symbol, range = "1M") {
  const { data } = await axios.get(`/investments/history/${symbol}`, {
    params: { range },
  });
  return data;
}

export async function transferFunds(amount) {
  const { data } = await axios.post("/investments/transfer", {
    amount: Number(amount),
  });
  return data;
}

export async function buyStock({ symbol, dollarAmount }) {
  const { data } = await axios.post("/investments/buy", {
    symbol,
    dollarAmount: Number(dollarAmount),
  });
  return data;
}

export async function sellStock({ symbol, dollarAmount }) {
  const { data } = await axios.post("/investments/sell", {
    symbol,
    dollarAmount: Number(dollarAmount),
  });
  return data;
}

export async function createRecurringBuy({ symbol, dollarAmount, frequency }) {
  const { data } = await axios.post("/investments/recurring-buys", {
    symbol,
    dollarAmount: Number(dollarAmount),
    frequency,
  });
  return data;
}