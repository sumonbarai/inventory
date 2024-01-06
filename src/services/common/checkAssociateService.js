const checkAssociateService = async (Model, query) => {
  const result = await Model.aggregate([
    {
      $match: query,
    },
  ]);

  if (result.length > 0) {
    return true;
  }
  return false;
};

module.exports = checkAssociateService;
