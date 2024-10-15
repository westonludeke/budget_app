const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { isAuthenticated } = require('./middleware/authMiddleware');

router.put('/update/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { closeDate, category } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { closeDate, category },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Error updating transaction' });
  }
});

router.put('/update-bulk', isAuthenticated, async (req, res) => {
  try {
    const { updates } = req.body;
    const updatePromises = updates.map(update =>
      Transaction.findByIdAndUpdate(
        update.id,
        { closeDate: update.closeDate, category: update.category },
        { new: true }
      )
    );

    const updatedTransactions = await Promise.all(updatePromises);

    res.json(updatedTransactions);
  } catch (error) {
    console.error('Error updating transactions:', error);
    res.status(500).json({ message: 'Error updating transactions' });
  }
});

router.get('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }
    res.render('editTransaction', { transaction });
  } catch (error) {
    console.error('Error fetching transaction for edit:', error);
    res.status(500).send('Error fetching transaction');
  }
});

router.put('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Error updating transaction' });
  }
});

router.delete('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully', id });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Error deleting transaction' });
  }
});

module.exports = router;