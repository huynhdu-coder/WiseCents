const getGoals = (req, res) => {
  const { userId } = req.params;
  res.json({ message: `Get goals for user ${userId}` });
};
module.exports = { getGoals };
