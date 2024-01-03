const listOneJoinService = async (
  Model,
  pageNo,
  perPage,
  query,
  SearchQuery,
  JoinStage
) => {
  const skip = (pageNo - 1) * perPage;

  let data;
  if (SearchQuery) {
    data = await Model.aggregate([
      {
        $match: query,
      },
      {
        ...JoinStage,
      },
      {
        $match: SearchQuery,
      },
      {
        $facet: {
          total: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: perPage }],
        },
      },
    ]);
  } else {
    data = await Model.aggregate([
      {
        $match: query,
      },
      {
        ...JoinStage,
      },
      {
        $facet: {
          total: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: perPage }],
        },
      },
    ]);
  }
  return data;
};

module.exports = listOneJoinService;
