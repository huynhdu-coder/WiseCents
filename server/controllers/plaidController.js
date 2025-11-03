const { encryptGCM } = require('../utils/crypto');
const pool = require('../config/database');

app.post('/api/plaid/exchange', async (req, res) => {
  try {
    const { public_token, user_id } = req.body;

    const resp = await plaidClient.itemPublicTokenExchange({ public_token });
    const accessToken = resp.data.access_token;
    const itemId = resp.data.item_id;

    const { ciphertextB64, iv, tag } = encryptGCM(accessToken);

    await pool.query(
      `INSERT INTO plaid_items (user_id, plaid_item_id, access_token_cipher, access_token_iv, access_token_tag)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (plaid_item_id) DO UPDATE
         SET access_token_cipher = EXCLUDED.access_token_cipher,
             access_token_iv     = EXCLUDED.access_token_iv,
             access_token_tag    = EXCLUDED.access_token_tag`,
      [user_id, itemId, ciphertextB64, iv, tag]
    );


    res.json({ ok: true, item_id: itemId });
  } catch (err) {
    console.error('Plaid exchange failed:', err?.response?.data || err.message);
    res.status(500).json({ ok: false, error: 'Plaid exchange failed' });
  }
});
