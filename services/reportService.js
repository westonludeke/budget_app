const Transaction = require('../models/Transaction');

exports.getAggregatedTransactions = async (closeDate) => {
  try {
    let dateFilter = {};
    if (closeDate) {
      // Convert YYYY-MM to MM/YYYY
      const [year, month] = closeDate.split('-');
      const formattedCloseDate = `${month.padStart(2, '0')}/${year}`;
      dateFilter = {
        closeDate: formattedCloseDate
      };
    }

    console.log('dateFilter:', JSON.stringify(dateFilter, null, 2));

    const aggregatedData = await Transaction.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            month: "$closeDate",
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
              total: { $ifNull: ["$total", 0] }  // This ensures total is always defined
            }
          }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    console.log('Raw aggregatedData:', JSON.stringify(aggregatedData, null, 2));

    return aggregatedData;
  } catch (error) {
    console.error('Error in getAggregatedTransactions:', error);
    throw error;
  }
};