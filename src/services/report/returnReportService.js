const ReturnProductModel = require("../../models/return/ReturnProductModel");

const returnReportService = (email, from, to) => {
  return ReturnProductModel.aggregate([
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
            $group: { _id: 0, total: { $sum: "$total" } },
          },
        ],
        data: [
          {
            $lookup: {
              from: "returns",
              localField: "returnId",
              foreignField: "_id",
              as: "return",
            },
          },
          {
            $unwind: "$return",
          },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $unwind: "$product",
          },
        ],
      },
    },
  ]);
};

module.exports = returnReportService;
