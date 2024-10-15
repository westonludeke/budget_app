const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');
const reportService = require('../services/reportService');

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const { closeDate } = req.query;
    const aggregatedData = await reportService.getAggregatedTransactions(closeDate);

    console.log('closeDate:', closeDate);
    console.log('aggregatedData:', JSON.stringify(aggregatedData, null, 2));

    if (req.xhr) {
      return res.render('partials/_reportContent', {
        aggregatedData,
        closeDate,
        user: req.session.user
      });
    }

    res.render('reports', {
      title: 'Expense Reports',
      aggregatedData,
      closeDate,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).render('error', { message: 'Error generating report' });
  }
});

module.exports = router;