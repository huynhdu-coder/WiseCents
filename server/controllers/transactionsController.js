const getTransactions = (req, res) => {
  const { userId } = req.params;
  res.json({ message: `Get transactions for user ${userId}` });
};
module.exports = { getTransactions };