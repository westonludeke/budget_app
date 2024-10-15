const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');
const reportService = require('../services/reportService');

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const aggregatedData = await reportService.getAggregatedTransactions();
    res.render('reports', { title: 'Reports', aggregatedData });
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).send('Error generating report');
  }
});

module.exports = router;