const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const middleware = [
  morgan("dev"),
  cors(),
  express.json({ limit: "50mb" }),
  express.urlencoded({ extended: true, limit: "50mb" }),
  helmet(),
  mongoSanitize(),
  hpp(),
  limiter,
];

module.exports = middleware;
