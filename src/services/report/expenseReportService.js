const ExpenseModel = require("../../models/expense/ExpenseModel");

const expenseReportService = (email, from, to) => {
  return ExpenseModel.aggregate([
    {
      $match: {
        userEmail: email,
        createdAt: { $gte: new Date(from), $lte: new Date(to) },
      },
    },
    {
      $facet: {
        total: [
          {
            $group: { _id: 0, total: { $sum: "$amount" } },
          },
        ],
        data: [
          {
            $lookup: {
              from: "expensetypes",
              localField: "typeId",
              foreignField: "_id",
              as: "type",
            },
          },
          {
            $unwind: "$type",
          },
        ],
      },
    },
  ]);
};

module.exports = expenseReportService;
