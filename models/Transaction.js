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
        return v === 'No Date' || /^(0[1-9]|1[0-2])\/\d{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid close date! Use format MM/YYYY or "No Date".`
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

transactionSchema.statics.getAggregatedData = async function() {
  try {
    const result = await this.aggregate([
      {
        $group: {
          _id: {
            month: { $substr: ["$closeDate", 0, 7] },
            category: "$category"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: "$_id.month",
          categories: {
            $push: {
              category: "$_id.category",
              total: "$total"
            }
          },
          monthTotal: { $sum: "$total" }
        }
      },
      { $sort: { _id: -1 } }
    ]);
    console.log("Aggregated data successfully fetched.");
    return result;
  } catch (error) {
    console.error("Error fetching aggregated data:", error);
    throw error; // Ensure the error is thrown to be handled by the caller
  }
};

module.exports = mongoose.model('Transaction', transactionSchema);