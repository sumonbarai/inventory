const CustomerModel = require("../../models/customer/customerModel");
const createService = require("../../services/common/createService");
const dropDownService = require("../../services/common/dropDownService");
const findByPropertyService = require("../../services/common/findByPropertyService");
const listService = require("../../services/common/listService");
const updateService = require("../../services/common/updateService");
const customError = require("../../utilities/customError");

const createCustomer = async (req, res, next) => {
  try {
    const { name, email, address, mobile } = req.body;
    const userEmail = req.headers?.email;

    // validation
    if (!name) throw customError("Customer name required", 400);
    if (!email) throw customError("Customer email required", 400);
    if (!address) throw customError("Customer address required", 400);
    if (!mobile) throw customError("Customer mobile required", 400);

    // checking email address exits or not
    if (email) {
      const customer = await findByPropertyService(CustomerModel, {
        userEmail,
        email,
      });
      if (customer) throw customError("email address already exits", 400);
    }
    // checking mobile exits or not
    if (mobile) {
      const customer = await findByPropertyService(CustomerModel, {
        userEmail,
        mobile,
      });
      if (customer) throw customError("mobile already exits", 400);
    }

    // now crate a new customer
    const brand = await createService(CustomerModel, {
      userEmail,
      name,
      email,
      address,
      mobile,
    });

    // every think is ok now response to client
    res.status(200).json({
      message: "customer create successfully",
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userEmail = req.headers?.email;

    // validation
    if (!id) throw customError("customer id required", 400);

    // checking email address exits or not
    if (req.body.email) {
      const customer = await findByPropertyService(CustomerModel, {
        userEmail,
        email: req.body.email,
      });
      if (customer) throw customError("email address already exits", 400);
    }
    // checking mobile exits or not
    if (req.body.mobile) {
      const customer = await findByPropertyService(CustomerModel, {
        userEmail,
        mobile: req.body.mobile,
      });
      if (customer) throw customError("mobile already exits", 400);
    }

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

module.exports = {
  createCustomer,
  updateCustomer,
  customerList,
  customerDropDown,
};
