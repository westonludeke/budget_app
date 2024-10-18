const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { isAuthenticated } = require('./middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    console.log('Fetching transactions...');
    const transactions = await Transaction.find().sort({ closeDate: -1 });
    console.log('Fetched transactions:', transactions.map(t => ({ _id: t._id, closeDate: t.closeDate })));

    console.log('Grouping transactions...');
    const groupedTransactions = transactions.reduce((groups, transaction) => {
      const closeDate = transaction.closeDate === "01/2000" ? "No Date" : (transaction.closeDate || 'Uncategorized');
      if (!groups[closeDate]) {
        groups[closeDate] = [];
      }
      groups[closeDate].push(transaction);
      return groups;
    }, {});
    console.log('Grouped transactions:', Object.keys(groupedTransactions).map(key => ({ closeDate: key, count: groupedTransactions[key].length })));

    console.log('Sorting grouped transactions...');
    const sortedGroups = Object.entries(groupedTransactions)
      .sort(([a], [b]) => {
        if (a === "No Date") return 1;
        if (b === "No Date") return -1;
        return new Date(b.split('/').reverse().join('-')) - new Date(a.split('/').reverse().join('-'));
      });
    console.log('Sorted groups:', sortedGroups.map(([closeDate, transactions]) => ({ closeDate, count: transactions.length })));

    console.log('Rendering index page with transactionGroups...');
    res.render('index', { transactionGroups: sortedGroups });
  } catch (error) {
    console.error('Error in transaction route:', error);
    res.status(500).send('Error fetching transactions');
  }
});

router.get('/:id([0-9a-fA-F]{24})', isAuthenticated, async (req, res) => {
  try {
    console.log('Fetching transaction with ID:', req.params.id);
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      console.log('Transaction not found:', req.params.id);
      return res.status(404).json({ message: 'Transaction not found' });
    }
    console.log('Transaction fetched:', transaction);
    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Error fetching transaction', error: error.message });
  }
});

router.put('/update/:id', isAuthenticated, async (req, res) => {
  console.log('Received update request for transaction:', req.params.id);
  console.log('Request body:', req.body);
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('Update data:', updateData);

    const transaction = await Transaction.findByIdAndUpdate(id, updateData, { new: true });
    if (!transaction) {
      console.log('Transaction not found:', id);
      return res.status(404).json({ message: 'Transaction not found' });
    }

    console.log('Updated transaction:', transaction);
    res.json({ message: 'Transaction updated successfully', transaction });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Error updating transaction', error: error.message });
  }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  console.log('Received delete request for transaction:', req.params.id);
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      console.log('Transaction not found:', id);
      return res.status(404).json({ message: 'Transaction not found' });
    }
    console.log('Deleted transaction:', transaction);
    res.json({ message: 'Transaction deleted successfully', transactionId: id });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Error deleting transaction', error: error.message });
  }
});

module.exports = router;