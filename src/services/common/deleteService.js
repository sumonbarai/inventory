const deleteService = async (Model, query) => {
  return Model.deleteOne(query);
};

module.exports = deleteService;
