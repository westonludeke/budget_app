const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { isAuthenticated } = require('./middleware/authMiddleware');

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ closeDate: -1 });

    const groupedTransactions = transactions.reduce((acc, transaction) => {
      const closeDate = transaction.closeDate || 'Uncategorized';
      if (!acc[closeDate]) {
        acc[closeDate] = {
          transactions: [],
          count: 0,
          total: 0
        };
      }
      acc[closeDate].transactions.push(transaction);
      acc[closeDate].count++;
      acc[closeDate].total += transaction.amount;
      return acc;
    }, {});

    // Sort the grouped transactions by close date in descending order
    const sortedGroupedTransactions = Object.entries(groupedTransactions)
      .sort(([a], [b]) => {
        if (a === 'Uncategorized') return 1;
        if (b === 'Uncategorized') return -1;
        return new Date(b) - new Date(a);
      })
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    res.render('index', {
      groupedTransactions: sortedGroupedTransactions,
      totalTransactions: transactions.length,
      currentPage: 1,
      totalPages: 1,
      session: req.session,
      user: req.user  // Add this line to pass user information to the view
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    console.error(error.stack);
    res.status(500).send('Error fetching transactions');
  }
});

module.exports = router;