const ExpenseModel = require("../../models/expense/ExpenseModel");
const createService = require("../../services/common/createService");
const deleteService = require("../../services/common/deleteService");
const listOneJoinService = require("../../services/common/listOneJoinService");
const updateService = require("../../services/common/updateService");
const customError = require("../../utilities/customError");

const createExpense = async (req, res, next) => {
  try {
    const { name, typeId, amount } = req.body;
    const userEmail = req.headers?.email;

    // validation
    if (!name) throw customError("expense name required", 400);
    if (!typeId) throw customError("expense Type id required", 400);
    if (!amount) throw customError("expense amount required", 400);

    // now crate a new expense
    const result = await createService(ExpenseModel, {
      ...req.body,
      userEmail,
    });

    // every think is ok now response to client
    res.status(200).json({
      message: "expense create successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userEmail = req.headers?.email;
    const reqBody = req.body;
    delete reqBody.userEmail;

    // validation
    if (!id) throw customError("expense id required", 400);

    const result = await updateService(
      ExpenseModel,
      { _id: id, userEmail },
      { ...reqBody }
    );
    if (!result) throw customError("invalid id", 400);

    // every think is ok now response to client
    res.status(200).json({
      message: "expense update successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const expenseList = async (req, res, next) => {
  try {
    const pageNo = Number(req.query.pageNo) || 1;
    const perPage = Number(req.query.perPage) || 5;
    const { searchValue } = req.query;
    const { email } = req.headers;
    const queryExp = {
      $or: [
        { name: { $regex: searchValue, $options: "i" } },
        { amount: { $regex: searchValue, $options: "i" } },
        { note: { $regex: searchValue, $options: "i" } },
        { "type.name": { $regex: searchValue, $options: "i" } },
      ],
    };
    const SearchQuery = searchValue ? queryExp : "";
    const query = { userEmail: email };
    const JoinStage = {
      $lookup: {
        from: "expensetypes",
        localField: "typeId",
        foreignField: "_id",
        as: "type",
      },
    };

    const data = await listOneJoinService(
      ExpenseModel,
      pageNo,
      perPage,
      query,
      SearchQuery,
      JoinStage
    );

    // every think is ok now response to client
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { email } = req.headers;
    if (!_id) throw customError("invalid id", 400);

    // now delete process
    const result = await deleteService(ExpenseModel, { _id, userEmail: email });

    if (!result) {
      throw customError("delete failed", 400);
    }

    // every think is ok now response to client
    res.status(200).json({
      message: "delete success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  updateExpense,
  expenseList,
  deleteExpense,
};
