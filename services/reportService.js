const Transaction = require('../models/Transaction');

exports.getAggregatedTransactions = async () => {
  try {
    const aggregatedData = await Transaction.aggregate([
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
          }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    return aggregatedData;
  } catch (error) {
    console.error('Error aggregating transactions:', error);
    throw error;
  }
};