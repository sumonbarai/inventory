const listTwoJoinService = async (
  Model,
  pageNo,
  perPage,
  query,
  SearchQuery,
  JoinStage1,
  JoinStage2
) => {
  const skip = (pageNo - 1) * perPage;

  let data;
  if (SearchQuery) {
    data = await Model.aggregate([
      {
        $match: query,
      },
      {
        ...JoinStage1,
      },
      {
        ...JoinStage2,
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
        ...JoinStage1,
      },
      {
        ...JoinStage2,
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

module.exports = listTwoJoinService;
