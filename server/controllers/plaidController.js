import { plaidClient } from '../services/plaidService.js';
import { savePlaidItem } from '../models/plaidItemModel.js';

export const exchangePublicToken = async (req, res) => {
  try {
    const { public_token, userId } = req.body;

    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const access_token = response.data.access_token;
    const item_id = response.data.item_id;

    await savePlaidItem(userId, access_token, item_id);

    res.json({ success: true, item_id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Token exchange failed' });
  }
};
