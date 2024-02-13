const salesProductModel = require("../../models/sales/SalesProductModel");

const salesReportService = (email, from, to) => {
  return salesProductModel.aggregate([
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
              from: "sales",
              localField: "salesId",
              foreignField: "_id",
              as: "sale",
            },
          },
          {
            $unwind: "$sale",
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

module.exports = salesReportService;
