const findByPropertyService = (Model, query) => {
  return Model.findOne(query);
};

module.exports = findByPropertyService;
