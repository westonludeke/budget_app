const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');
const reportService = require('../services/reportService');

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const aggregatedData = await reportService.getAggregatedTransactions();
    res.render('reports', {
      title: 'Expense Reports',
      aggregatedData,
      user: req.session.user // Pass user information to the view
    });
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).render('error', { message: 'Error generating report' });
  }
});

module.exports = router;