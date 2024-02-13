const expenseReportService = require("../../services/report/expenseReportService");
const purchaseReportService = require("../../services/report/purchaseReportService");
const returnReportService = require("../../services/report/returnReportService");
const salesReportService = require("../../services/report/salesReportService");
const customError = require("../../utilities/customError");

const expenseReport = async (req, res, next) => {
  try {
    const { email } = req.headers;
    const { from } = req.body;
    const { to } = req.body;

    if (!from) throw customError("from date is require", 400);
    if (!to) throw customError("to date is require", 400);

    const data = await expenseReportService(email, from, to);

    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const purchaseReport = async (req, res, next) => {
  try {
    const { email } = req.headers;
    const { from } = req.body;
    const { to } = req.body;

    if (!from) throw customError("from date is require", 400);
    if (!to) throw customError("to date is require", 400);

    const data = await purchaseReportService(email, from, to);

    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const salesReport = async (req, res, next) => {
  try {
    const { email } = req.headers;
    const { from } = req.body;
    const { to } = req.body;

    if (!from) throw customError("from date is require", 400);
    if (!to) throw customError("to date is require", 400);

    const data = await salesReportService(email, from, to);

    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const returnReport = async (req, res, next) => {
  try {
    const { email } = req.headers;
    const { from } = req.body;
    const { to } = req.body;
    if (!from) throw customError("from date is require", 400);
    if (!to) throw customError("to date is require", 400);

    const data = await returnReportService(email, from, to);
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { expenseReport, purchaseReport, salesReport, returnReport };
