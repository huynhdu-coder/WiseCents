import axios from "axios";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
async function fetchQuote(symbol, attempt = 1) {
  try {
    return await axios.get(`${FINNHUB_BASE_URL}/quote`, {
      params: {
        symbol: symbol.toUpperCase(),
        token: FINNHUB_API_KEY,
      },
      timeout: 8000,
    });
  } catch (error) {
    const code = error.code || error.message;

    if (attempt < 2 && ["ENOTFOUND", "ECONNRESET", "ETIMEDOUT"].includes(code)) {
      console.warn(`Retrying ${symbol} due to ${code}...`);
      return fetchQuote(symbol, attempt + 1);
    }

    throw error;
  }
}

export async function getStockCandles(symbol, resolution, from, to) {
  const { data } = await axios.get("https://finnhub.io/api/v1/stock/candle", {
    params: {
      symbol,
      resolution,
      from,
      to,
      token: process.env.FINNHUB_API_KEY,
    },
  });

  return data;
}

export async function getStockQuote(symbol) {
  try {
    const { data } = await fetchQuote(symbol);

    return {
      symbol: symbol.toUpperCase(),
      currentPrice: Number(data.c || 0),
      change: Number(data.d || 0),
      percentChange: Number(data.dp || 0),
      previousClose: Number(data.pc || 0),
      high: Number(data.h || 0),
      low: Number(data.l || 0),
      open: Number(data.o || 0),
      timestamp: Number(data.t || 0),
      error: null,
    };
  } catch (error) {
    console.error(`Finnhub failed for ${symbol}:`, error.code || error.message);

    return {
      symbol: symbol.toUpperCase(),
      currentPrice: 0,
      change: 0,
      percentChange: 0,
      error: error.code || error.message,
    };
  }
}