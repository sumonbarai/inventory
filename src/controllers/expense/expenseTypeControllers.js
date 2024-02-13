const { default: mongoose } = require("mongoose");
const ExpenseTypeModel = require("../../models/expense/ExpenseTypeModel");
const createService = require("../../services/common/createService");
const dropDownService = require("../../services/common/dropDownService");
const findByPropertyService = require("../../services/common/findByPropertyService");
const listService = require("../../services/common/listService");
const updateService = require("../../services/common/updateService");
const customError = require("../../utilities/customError");
const checkAssociateService = require("../../services/common/checkAssociateService");
const deleteService = require("../../services/common/deleteService");
const ExpenseModel = require("../../models/expense/ExpenseModel");

const createExpenseType = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userEmail = req.headers?.email;

    // validation
    if (!name) throw customError("expenseType name required", 400);

    // checking already create same category
    const isExist = await findByPropertyService(ExpenseTypeModel, {
      userEmail,
      name,
    });
    if (isExist) throw customError("expenseType name already exits", 400);

    // now crate a new Category
    const result = await createService(ExpenseTypeModel, { userEmail, name });

    // every think is ok now response to client
    res.status(200).json({
      message: "expenseType create successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const expenseTypeDetailsById = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const userEmail = req.headers?.email;

    // validation
    if (!_id) throw customError("expense type _id required", 400);

    const query = { _id, userEmail };
    const result = await findByPropertyService(ExpenseTypeModel, query);

    if (!result) throw customError("expense type not found", 404);

    // every think is ok now response to client
    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateExpenseType = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const userEmail = req.headers?.email;

    // validation
    if (!name) throw customError("expenseType name required", 400);
    if (!id) throw customError("expenseType id required", 400);

    // checking Category exits or not
    const expenseType = await findByPropertyService(ExpenseTypeModel, {
      userEmail,
      name,
    });
    if (expenseType) throw customError("expenseType name already exist", 400);

    const result = await updateService(
      ExpenseTypeModel,
      { _id: id, userEmail },
      { name }
    );
    if (!result) throw customError("invalid id", 400);

    // every think is ok now response to client
    res.status(200).json({
      message: "expenseType update successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const expenseTypeList = async (req, res, next) => {
  try {
    const pageNo = Number(req.query.pageNo) || 1;
    const perPage = Number(req.query.perPage) || 5;
    const { searchValue } = req.query;
    const { email } = req.headers;
    const queryExp = {
      $or: [{ name: { $regex: searchValue, $options: "i" } }],
    };
    const SearchQuery = searchValue ? queryExp : "";
    const query = { userEmail: email };

    const data = await listService(
      ExpenseTypeModel,
      pageNo,
      perPage,
      query,
      SearchQuery
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

const expenseTypeDropDown = async (req, res, next) => {
  try {
    const { email } = req.headers;

    const query = { userEmail: email };
    const projection = { name: 1 };

    const data = await dropDownService(ExpenseTypeModel, query, projection);

    // every think is ok now response to client
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteExpenseType = async (req, res, next) => {
  try {
    const { email } = req.headers;
    const { _id } = req.params;

    // search associate model
    const query = { typeId: new mongoose.Types.ObjectId(_id) };
    const isExist = await checkAssociateService(ExpenseModel, query);
    if (isExist) throw customError("expense Type associate in Expense", 400);

    // now delete process
    const result = await deleteService(ExpenseTypeModel, {
      _id,
      userEmail: email,
    });

    // every think is ok now response to client
    res.status(200).json({
      message: "delete success",
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpenseType,
  expenseTypeDetailsById,
  updateExpenseType,
  expenseTypeList,
  expenseTypeDropDown,
  deleteExpenseType,
};
