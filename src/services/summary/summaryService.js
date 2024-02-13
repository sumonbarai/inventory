const summaryService = (Model, email, fieldName) => {
  return Model.aggregate([
    {
      $match: { userEmail: email },
    },
    {
      $facet: {
        total: [
          {
            $group: {
              _id: null,
              total: { $sum: `$${fieldName}` },
            },
          },
        ],
        data: [
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              total: { $sum: `$${fieldName}` },
            },
          },
          { $sort: { _id: -1 } },
          { $limit: 30 },
        ],
      },
    },
  ]);
};

module.exports = summaryService;
