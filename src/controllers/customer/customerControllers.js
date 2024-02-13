const { default: mongoose } = require("mongoose");
const CustomerModel = require("../../models/customer/customerModel");
const createService = require("../../services/common/createService");
const dropDownService = require("../../services/common/dropDownService");

const listService = require("../../services/common/listService");
const updateService = require("../../services/common/updateService");
const customError = require("../../utilities/customError");
const checkAssociateService = require("../../services/common/checkAssociateService");
const SalesModel = require("../../models/sales/SalesModel");
const ReturnModel = require("../../models/return/ReturnModel");
const deleteService = require("../../services/common/deleteService");
const findByPropertyService = require("../../services/common/findByPropertyService");

const createCustomer = async (req, res, next) => {
  try {
    const { name, email, address, mobile } = req.body;
    const userEmail = req.headers?.email;

    // validation
    if (!name) throw customError("Customer name required", 400);
    if (!email) throw customError("Customer email required", 400);
    if (!address) throw customError("Customer address required", 400);
    if (!mobile) throw customError("Customer mobile required", 400);

    // now crate a new customer
    const customer = await createService(CustomerModel, {
      userEmail,
      name,
      email,
      address,
      mobile,
    });

    // every think is ok now response to client
    res.status(200).json({
      message: "customer create successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

const customerDetailsById = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const userEmail = req.headers?.email;

    // validation
    if (!_id) throw customError("customer _id required", 400);

    const query = { _id, userEmail };
    const result = await findByPropertyService(CustomerModel, query);

    if (!result) throw customError("customer not found", 404);

    // every think is ok now response to client
    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userEmail = req.headers?.email;

    const result = await updateService(
      CustomerModel,
      { _id: id, userEmail },
      { ...req.body }
    );

    if (!result) throw customError("invalid id", 400);
    // every think is ok now response to client
    res.status(200).json({
      message: "customer update successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const customerList = async (req, res, next) => {
  try {
    const pageNo = Number(req.query.pageNo) || 1;
    const perPage = Number(req.query.perPage) || 5;
    const { searchValue } = req.query;
    const { email } = req.headers;
    const queryExp = {
      $or: [
        { name: { $regex: searchValue, $options: "i" } },
        { email: { $regex: searchValue, $options: "i" } },
        { mobile: { $regex: searchValue, $options: "i" } },
        { address: { $regex: searchValue, $options: "i" } },
      ],
    };
    const SearchQuery = searchValue ? queryExp : "";
    const query = { userEmail: email };

    const data = await listService(
      CustomerModel,
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

const customerDropDown = async (req, res, next) => {
  try {
    const { email } = req.headers;

    const query = { userEmail: email };
    const projection = { name: 1 };

    const data = await dropDownService(CustomerModel, query, projection);

    // every think is ok now response to client
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const { email } = req.headers;
    const { _id } = req.params;

    // search associate model
    const query = { customerId: new mongoose.Types.ObjectId(_id) };

    {
      const isExist = await checkAssociateService(SalesModel, query);
      if (isExist) throw customError("customer associate in sales", 400);
    }

    {
      const isExist = await checkAssociateService(ReturnModel, query);
      if (isExist) throw customError("customer associate in return", 400);
    }

    // now delete process
    const result = await deleteService(CustomerModel, {
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
  createCustomer,
  customerDetailsById,
  updateCustomer,
  customerList,
  customerDropDown,
  deleteCustomer,
};
