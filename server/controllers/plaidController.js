import prisma from "../config/prisma.js";
import { encrypt } from "../utils/encryption.js";
import {
  createLinkTokenPlaid,
  exchangePublicTokenPlaid,
} from "../services/plaidService.js";
import {
  syncAccounts,
  syncTransactions,
} from "../services/plaidSyncService.js";

export const createLinkToken = async (req, res) => {
  try {
    const response = await createLinkTokenPlaid(req.userId);
    res.json({ link_token: response.data.link_token });
  } catch (err) {
    console.error("Create link token error:", err);
    res.status(500).json({ error: "Failed to create link token" });
  }
};

export const exchangePublicToken = async (req, res) => {
  try {
    const { public_token } = req.body;

    if (!public_token) {
      return res.status(400).json({ error: "Public token missing" });
    }

    const response = await exchangePublicTokenPlaid(public_token);

    const encryptedToken = encrypt(response.data.access_token);

    // Save or update plaid item
    await prisma.plaid_items.upsert({
      where: {
        plaid_item_id: response.data.item_id,
      },
      update: {
        plaid_access_token: encryptedToken,
      },
      create: {
        user_id: req.userId,
        plaid_item_id: response.data.item_id,
        plaid_access_token: encryptedToken,
        cursor: null,
      },
    });

    // Initial sync
    await syncAccounts(req.userId);
    await syncTransactions(req.userId);

    res.json({ success: true });

  } catch (err) {
    console.error("Exchange public token error:", err);
    res.status(500).json({ error: "Failed to exchange token" });
  }
};

