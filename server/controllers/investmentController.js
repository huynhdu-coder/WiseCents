import prisma from "../config/prisma.js";
import { getStockQuote } from "../services/finnhubService.js";


function toNumber(value) {
  return Number(value || 0);
}

function getNextRunDate(date, frequency) {
  const next = new Date(date);

  if (frequency === "DAILY") next.setDate(next.getDate() + 1);
  if (frequency === "WEEKLY") next.setDate(next.getDate() + 7);
  if (frequency === "BIWEEKLY") next.setDate(next.getDate() + 14);
  if (frequency === "MONTHLY") next.setMonth(next.getMonth() + 1);

  return next;
}

export async function ensurePaperAccount(req, res) {
  try {
    const userId = req.userId;

    let account = await prisma.paper_accounts.findUnique({
      where: { user_id: userId },
    });

    if (!account) {
      account = await prisma.paper_accounts.create({
        data: {
          user_id: userId,
          cash_balance: 0,
          starting_balance: 0,
        },
      });
    }

    res.json(account);
  } catch (error) {
    console.error("ensurePaperAccount error:", error);
    res.status(500).json({ error: "Failed to create paper account" });
  }
}

export async function getQuote(req, res) {
  try {
    const { symbol } = req.params;
    const quote = await getStockQuote(symbol);
    res.json(quote);
  } catch (error) {
    console.error("getQuote error:", error);
    res.status(500).json({ error: "Failed to fetch quote" });
  }
}

export async function transferFromChecking(req, res) {
  try {
    const userId = req.userId;
    const { amount } = req.body;

    const transferAmount = Number(amount);

    if (!transferAmount || transferAmount <= 0) {
      return res.status(400).json({ error: "Valid transfer amount is required" });
    }

    const paperAccount = await prisma.paper_accounts.findUnique({
  where: { user_id: userId },
  include: {
    paper_positions: {
      include: {
        investment_assets: true,
      },
    },
    recurring_buys: {
      where: { is_active: true },
      include: {
        investment_assets: true,
      },
    },
  },
});

    if (!paperAccount) {
      paperAccount = await prisma.paper_accounts.create({
        data: {
          user_id: userId,
          cash_balance: 0,
          starting_balance: 0,
        },
      });
    }

    const checkingAccount = await prisma.bank_accounts.findFirst({
      where: {
        user_id: userId,
        subtype: "checking",
        is_hidden: false,
      },
      orderBy: {
        current_balance: "desc",
      },
    });

    if (!checkingAccount) {
      return res.status(400).json({ error: "No checking account found" });
    }

    const checkingBalance = toNumber(checkingAccount.current_balance);

    if (transferAmount > checkingBalance) {
      return res.status(400).json({ error: "Transfer amount exceeds checking balance" });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedChecking = await tx.bank_accounts.update({
        where: { account_id: checkingAccount.account_id },
        data: {
          current_balance: checkingBalance - transferAmount,
        },
      });

      const updatedPaperAccount = await tx.paper_accounts.update({
        where: { paper_account_id: paperAccount.paper_account_id },
        data: {
          cash_balance: toNumber(paperAccount.cash_balance) + transferAmount,
          starting_balance: toNumber(paperAccount.starting_balance) + transferAmount,
        },
      });

      const transferLog = await tx.investment_transfers.create({
        data: {
          user_id: userId,
          from_account_id: checkingAccount.account_id,
          paper_account_id: paperAccount.paper_account_id,
          amount: transferAmount,
        },
      });

      return {
        updatedChecking,
        updatedPaperAccount,
        transferLog,
      };
    });

    res.json({
      message: "Transfer successful",
      transferredAmount: transferAmount,
      checkingAccount: {
        account_id: result.updatedChecking.account_id,
        name: result.updatedChecking.name,
        new_balance: toNumber(result.updatedChecking.current_balance),
      },
      paperAccount: {
        paper_account_id: result.updatedPaperAccount.paper_account_id,
        cash_balance: toNumber(result.updatedPaperAccount.cash_balance),
        starting_balance: toNumber(result.updatedPaperAccount.starting_balance),
      },
      transfer: result.transferLog,
    });
  } catch (error) {
    console.error("transferFromChecking error:", error);
    res.status(500).json({ error: "Failed to transfer funds" });
  }
}

export async function buyStock(req, res) {
  try {
    const userId = req.userId;
    const { symbol, dollarAmount } = req.body;

    if (!symbol || !dollarAmount || Number(dollarAmount) <= 0) {
      return res.status(400).json({ error: "symbol and dollarAmount are required" });
    }

    let paperAccount = await prisma.paper_accounts.findUnique({
      where: { user_id: userId },
    });

    if (!paperAccount) {
      paperAccount = await prisma.paper_accounts.create({
        data: {
          user_id: userId,
          cash_balance: 0,
          starting_balance: 0,
        },
      });
    }

    const amount = Number(dollarAmount);

    if (toNumber(paperAccount.cash_balance) < amount) {
      return res.status(400).json({ error: "Insufficient investment cash" });
    }

    const quote = await getStockQuote(symbol);

    if (!quote.currentPrice || quote.currentPrice <= 0) {
      return res.status(400).json({ error: "Invalid stock price" });
    }

    const quantity = amount / quote.currentPrice;
    const upperSymbol = symbol.toUpperCase().trim();

    let asset = await prisma.investment_assets.findUnique({
      where: { symbol: upperSymbol },
    });

    if (!asset) {
      asset = await prisma.investment_assets.create({
        data: {
          symbol: upperSymbol,
          name: upperSymbol,
          exchange: "US",
        },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.paper_orders.create({
        data: {
          paper_account_id: paperAccount.paper_account_id,
          asset_id: asset.asset_id,
          side: "BUY",
          status: "FILLED",
          dollar_amount: amount,
          quantity,
          price: quote.currentPrice,
        },
      });

      const existingPosition = await tx.paper_positions.findUnique({
        where: {
          paper_account_id_asset_id: {
            paper_account_id: paperAccount.paper_account_id,
            asset_id: asset.asset_id,
          },
        },
      });

      if (existingPosition) {
        const newQuantity = toNumber(existingPosition.quantity) + quantity;
        const newTotalCost = toNumber(existingPosition.total_cost) + amount;
        const newAvgCost = newTotalCost / newQuantity;

        await tx.paper_positions.update({
          where: { position_id: existingPosition.position_id },
          data: {
            quantity: newQuantity,
            total_cost: newTotalCost,
            avg_cost: newAvgCost,
          },
        });
      } else {
        await tx.paper_positions.create({
          data: {
            paper_account_id: paperAccount.paper_account_id,
            asset_id: asset.asset_id,
            quantity,
            total_cost: amount,
            avg_cost: quote.currentPrice,
          },
        });
      }

      const updatedPaperAccount = await tx.paper_accounts.update({
        where: { paper_account_id: paperAccount.paper_account_id },
        data: {
          cash_balance: toNumber(paperAccount.cash_balance) - amount,
        },
      });

      await tx.price_cache.create({
        data: {
          asset_id: asset.asset_id,
          current_price: quote.currentPrice,
          previous_close: quote.previousClose,
          change: quote.change,
          percent_change: quote.percentChange,
        },
      });

      return {
        order,
        updatedPaperAccount,
      };
    });

    res.status(201).json({
      message: "Paper buy successful",
      ...result,
    });
  } catch (error) {
    console.error("buyStock error:", error);
    res.status(500).json({ error: "Failed to buy stock" });
  }
}

export async function sellStock(req, res) {
  try {
    const userId = req.userId;
    const { symbol, dollarAmount } = req.body;

    if (!symbol || !dollarAmount || Number(dollarAmount) <= 0) {
      return res.status(400).json({ error: "symbol and dollarAmount are required" });
    }

    const paperAccount = await prisma.paper_accounts.findUnique({
      where: { user_id: userId },
    });

    if (!paperAccount) {
      return res.status(400).json({ error: "Paper account not found" });
    }

    const upperSymbol = symbol.toUpperCase().trim();

    const asset = await prisma.investment_assets.findUnique({
      where: { symbol: upperSymbol },
    });

    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    const position = await prisma.paper_positions.findUnique({
      where: {
        paper_account_id_asset_id: {
          paper_account_id: paperAccount.paper_account_id,
          asset_id: asset.asset_id,
        },
      },
    });

    if (!position) {
      return res.status(400).json({ error: "No position found for this symbol" });
    }

    const quote = await getStockQuote(upperSymbol);

    if (!quote.currentPrice || quote.currentPrice <= 0) {
      return res.status(400).json({ error: "Invalid stock price" });
    }

    const sellAmount = Number(dollarAmount);
    const currentPrice = Number(quote.currentPrice);
    const ownedQuantity = toNumber(position.quantity);
    const totalCost = toNumber(position.total_cost);

    const requestedQuantity = sellAmount / currentPrice;

    const quantityToSell =
      requestedQuantity > ownedQuantity ? ownedQuantity : requestedQuantity;

    if (quantityToSell <= 0) {
      return res.status(400).json({ error: "Invalid sell quantity" });
    }

    const proceeds = quantityToSell * currentPrice;
    const remainingQuantity = ownedQuantity - quantityToSell;

    const avgCost = ownedQuantity > 0 ? totalCost / ownedQuantity : 0;
    const costBasisRemoved = avgCost * quantityToSell;
    const remainingTotalCost = Math.max(0, totalCost - costBasisRemoved);

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.paper_orders.create({
        data: {
          paper_account_id: paperAccount.paper_account_id,
          asset_id: asset.asset_id,
          side: "SELL",
          status: "FILLED",
          dollar_amount: proceeds,
          quantity: quantityToSell,
          price: currentPrice,
        },
      });

      if (remainingQuantity <= 0.0000001) {
        await tx.paper_positions.delete({
          where: {
            position_id: position.position_id,
          },
        });
      } else {
        await tx.paper_positions.update({
          where: {
            position_id: position.position_id,
          },
          data: {
            quantity: remainingQuantity,
            total_cost: remainingTotalCost,
            avg_cost: remainingQuantity > 0 ? remainingTotalCost / remainingQuantity : 0,
          },
        });
      }

      const updatedPaperAccount = await tx.paper_accounts.update({
        where: { paper_account_id: paperAccount.paper_account_id },
        data: {
          cash_balance: toNumber(paperAccount.cash_balance) + proceeds,
        },
      });

      await tx.price_cache.create({
        data: {
          asset_id: asset.asset_id,
          current_price: quote.currentPrice,
          previous_close: quote.previousClose,
          change: quote.change,
          percent_change: quote.percentChange,
        },
      });

      return {
        order,
        updatedPaperAccount,
        proceeds,
        quantitySold: quantityToSell,
        remainingQuantity,
      };
    });

    res.status(201).json({
      message: "Paper sell successful",
      symbol: upperSymbol,
      quantitySold: result.quantitySold,
      proceeds: result.proceeds,
      remainingQuantity: result.remainingQuantity,
      order: result.order,
      paperAccount: {
        paper_account_id: result.updatedPaperAccount.paper_account_id,
        cash_balance: toNumber(result.updatedPaperAccount.cash_balance),
      },
    });
  } catch (error) {
    console.error("sellStock error:", error);
    res.status(500).json({ error: "Failed to sell stock" });
  }
}

export async function getPortfolio(req, res) {
  try {
    const userId = req.userId;

    const paperAccount = await prisma.paper_accounts.findUnique({
      where: { user_id: userId },
      include: {
        paper_positions: {
          include: {
            investment_assets: true,
          },
        },
      },
    });

    if (!paperAccount) {
      return res.json({
        cashBalance: 0,
        startingBalance: 0,
        investedValue: 0,
        totalValue: 0,
        positions: [],
      });
    }

    const positions = await Promise.all(
      paperAccount.paper_positions.map(async (position) => {
        const symbol = position.investment_assets.symbol;
        const quote = await getStockQuote(symbol);

        const quantity = toNumber(position.quantity);
        const totalCost = toNumber(position.total_cost);
        const marketValue = quantity * quote.currentPrice;
        const gainLoss = marketValue - totalCost;

        return {
          symbol,
          quantity,
          avgCost: toNumber(position.avg_cost),
          totalCost,
          currentPrice: quote.currentPrice,
          marketValue,
          gainLoss,
          percentGainLoss: totalCost > 0 ? (gainLoss / totalCost) * 100 : 0,
        };
      })
    );

    const cashBalance = toNumber(paperAccount.cash_balance);
    const startingBalance = toNumber(paperAccount.starting_balance);
    const investedValue = positions.reduce((sum, p) => sum + p.marketValue, 0);
    const totalValue = cashBalance + investedValue;

    res.json({
      cashBalance,
      startingBalance,
      investedValue,
      totalValue,
      positions,
    });
  } catch (error) {
    console.error("getPortfolio error:", error);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
}

export async function createRecurringBuy(req, res) {
  try {
    const userId = req.userId;
    const { symbol, dollarAmount, frequency } = req.body;

    const validFrequencies = ["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY"];

    if (!symbol || !dollarAmount || Number(dollarAmount) <= 0 || !validFrequencies.includes(frequency)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const paperAccount = await prisma.paper_accounts.findUnique({
      where: { user_id: userId },
    });

    if (!paperAccount) {
      return res.status(400).json({ error: "Paper account not found" });
    }

    const upperSymbol = symbol.toUpperCase().trim();

    let asset = await prisma.investment_assets.findUnique({
      where: { symbol: upperSymbol },
    });

    if (!asset) {
      asset = await prisma.investment_assets.create({
        data: {
          symbol: upperSymbol,
          name: upperSymbol,
          exchange: "US",
        },
      });
    }

    const recurringBuy = await prisma.recurring_buys.create({
      data: {
        paper_account_id: paperAccount.paper_account_id,
        asset_id: asset.asset_id,
        dollar_amount: Number(dollarAmount),
        frequency,
        next_run_at: new Date(),
      },
    });

    res.status(201).json(recurringBuy);
  } catch (error) {
    console.error("createRecurringBuy error:", error);
    res.status(500).json({ error: "Failed to create recurring buy" });
  }
}

export async function runRecurringBuysInternal() {
  const plans = await prisma.recurring_buys.findMany({
    where: {
      is_active: true,
      next_run_at: { lte: new Date() },
    },
    include: {
      paper_accounts: true,
      investment_assets: true,
    },
  });

  for (const plan of plans) {
    try {
      const amount = toNumber(plan.dollar_amount);
      const cash = toNumber(plan.paper_accounts.cash_balance);

      if (cash < amount) continue;

      const quote = await getStockQuote(plan.investment_assets.symbol);
      if (!quote.currentPrice || quote.currentPrice <= 0) continue;

      const quantity = amount / quote.currentPrice;

      await prisma.$transaction(async (tx) => {
        await tx.paper_orders.create({
          data: {
            paper_account_id: plan.paper_account_id,
            asset_id: plan.asset_id,
            side: "BUY",
            status: "FILLED",
            dollar_amount: amount,
            quantity,
            price: quote.currentPrice,
          },
        });

        const existingPosition = await tx.paper_positions.findUnique({
          where: {
            paper_account_id_asset_id: {
              paper_account_id: plan.paper_account_id,
              asset_id: plan.asset_id,
            },
          },
        });

        if (existingPosition) {
          const newQuantity = toNumber(existingPosition.quantity) + quantity;
          const newTotalCost = toNumber(existingPosition.total_cost) + amount;

          await tx.paper_positions.update({
            where: { position_id: existingPosition.position_id },
            data: {
              quantity: newQuantity,
              total_cost: newTotalCost,
              avg_cost: newTotalCost / newQuantity,
            },
          });
        } else {
          await tx.paper_positions.create({
            data: {
              paper_account_id: plan.paper_account_id,
              asset_id: plan.asset_id,
              quantity,
              total_cost: amount,
              avg_cost: quote.currentPrice,
            },
          });
        }

        await tx.paper_accounts.update({
          where: { paper_account_id: plan.paper_account_id },
          data: {
            cash_balance: cash - amount,
          },
        });

        await tx.recurring_buys.update({
          where: { recurring_buy_id: plan.recurring_buy_id },
          data: {
            last_run_at: new Date(),
            next_run_at: getNextRunDate(new Date(), plan.frequency),
          },
        });
      });
    } catch (error) {
      console.error("Recurring buy failed:", error);
    }
  }
}

