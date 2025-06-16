const express = require('express');
const router = express.Router();
const { getGoals } = require('../controllers/goalsController');
router.get('/:userId', getGoals);
module.exports = router;