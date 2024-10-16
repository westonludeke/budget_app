const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  postDate: Date,
  transactionDate: Date,
  referenceNumber: String,
  merchantData: String,
  amount: Number,
  closeDate: String,
  category: String
});

module.exports = mongoose.model('Transaction', transactionSchema);