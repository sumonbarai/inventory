const dropDownService = (Model, query, projection) => {
  return Model.aggregate([
    {
      $match: query,
    },
    {
      $project: projection,
    },
  ]);
};

module.exports = dropDownService;
