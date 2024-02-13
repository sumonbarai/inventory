const PurchaseProductModel = require("../../models/purchase/PurchaseProductModel");

const purchaseReportService = (email, from, to) => {
  return PurchaseProductModel.aggregate([
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
            $group: { _id: 0, total: { $sum: "$grandTotal" } },
          },
        ],
        data: [
          {
            $lookup: {
              from: "purchases",
              localField: "purchaseId",
              foreignField: "_id",
              as: "purchase",
            },
          },
          {
            $unwind: "$purchase",
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

module.exports = purchaseReportService;
