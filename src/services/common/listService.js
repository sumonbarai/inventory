const listService = async (Model, pageNo, perPage, query, SearchQuery) => {
  const skip = (pageNo - 1) * perPage;

  let data;
  if (SearchQuery) {
    data = await Model.aggregate([
      {
        $match: query,
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
        $facet: {
          total: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: perPage }],
        },
      },
    ]);
  }
  return data;
};

module.exports = listService;
