const express = require("express");
const middleware = require("./middleware");
const router = require("../src/routes/api");
const notFoundHandler = require("./notFoundHandler");
const errorHandler = require("./errorHandler");
const app = express();

// middleware
app.use(middleware);

// routing setup
app.use("/api/v1", router);

// not found page
app.use("*", notFoundHandler);

// error handler middleware
app.use(errorHandler);

module.exports = app;
