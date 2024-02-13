const ExpenseModel = require("../../models/expense/ExpenseModel");
const PurchaseModel = require("../../models/purchase/PurchaseModel");
const ReturnModel = require("../../models/return/ReturnModel");
const SalesModel = require("../../models/sales/SalesModel");
const summaryService = require("../../services/summary/summaryService");

const expenseSummary = async (req, res, next) => {
  try {
    const { email } = req.headers;

    const data = await summaryService(ExpenseModel, email, "amount");
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const purchaseSummary = async (req, res, next) => {
  try {
    const { email } = req.headers;

    const data = await summaryService(PurchaseModel, email, "grandTotal");
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const salesSummary = async (req, res, next) => {
  try {
    const { email } = req.headers;

    const data = await summaryService(SalesModel, email, "grandTotal");
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const returnSummary = async (req, res, next) => {
  try {
    const { email } = req.headers;

    const data = await summaryService(ReturnModel, email, "grandTotal");
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  expenseSummary,
  purchaseSummary,
  salesSummary,
  returnSummary,
};
