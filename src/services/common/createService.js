const createService = (Model, data) => {
  const result = new Model({ ...data });
  return result.save();
};

module.exports = createService;
