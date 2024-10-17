const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');
const Transaction = require('../models/Transaction');

router.get('/reports', isAuthenticated, async (req, res) => {
  try {
    const aggregatedData = await Transaction.getAggregatedData();
    res.render('reports', { aggregatedData });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).send('Error generating report');
  }
});

module.exports = router;