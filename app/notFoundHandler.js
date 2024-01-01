const customError = require("../src/utilities/customError");

const notFoundHandler = (req, res, next) => {
  const error = customError("route not found", 404);
  next(error);
};

module.exports = notFoundHandler;
