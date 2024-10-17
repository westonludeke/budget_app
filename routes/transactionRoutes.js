const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { isAuthenticated } = require('./middleware/authMiddleware');

// Add this new route to fetch a single transaction
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Error fetching transaction', error: error.message });
  }
});

// Update the existing PUT route to handle all transaction fields
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

module.exports = router;