const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  postDate: Date,
  transactionDate: Date,
  referenceNumber: String,
  merchantData: String,
  amount: Number,
  closeDate: String, // Close Date field added
  category: String // Category field added
});

module.exports = mongoose.model('Transaction', transactionSchema);