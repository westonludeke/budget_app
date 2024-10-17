const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  postDate: Date,
  transactionDate: Date,
  referenceNumber: String,
  merchantData: String,
  amount: Number,
  closeDate: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(0[1-9]|1[0-2])\/\d{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid close date! Use format MM/YYYY.`
    }
  },
  category: {
    type: String,
    trim: true
  }
});

transactionSchema.pre('save', function(next) {
  console.log('Saving transaction:', this);
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);