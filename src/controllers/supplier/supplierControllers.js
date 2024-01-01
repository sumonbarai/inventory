const SupplierModel = require("../../models/supplier/supplierModel");
const createService = require("../../services/common/createService");
const dropDownService = require("../../services/common/dropDownService");
const findByPropertyService = require("../../services/common/findByPropertyService");
const listService = require("../../services/common/listService");
const updateService = require("../../services/common/updateService");
const customError = require("../../utilities/customError");

const createSupplier = async (req, res, next) => {
  try {
    const { name, email, address, mobile } = req.body;
    const userEmail = req.headers?.email;

    // validation
    if (!name) throw customError("supplier name required", 400);
    if (!email) throw customError("supplier email required", 400);
    if (!address) throw customError("supplier address required", 400);
    if (!mobile) throw customError("supplier mobile required", 400);

    // checking email address exits or not
    if (email) {
      const supplier = await findByPropertyService(SupplierModel, {
        userEmail,
        email,
      });
      if (supplier) throw customError("email address already exits", 400);
    }
    // checking mobile exits or not
    if (mobile) {
      const supplier = await findByPropertyService(SupplierModel, {
        userEmail,
        mobile,
      });
      if (supplier) throw customError("mobile already exits", 400);
    }

    // now crate a new supplier
    const brand = await createService(SupplierModel, {
      userEmail,
      name,
      email,
      address,
      mobile,
    });

    // every think is ok now response to client
    res.status(200).json({
      message: "supplier create successfully",
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userEmail = req.headers?.email;

    // validation
    if (!id) throw customError("supplier id required", 400);

    // checking email address exits or not
    if (req.body.email) {
      const supplier = await findByPropertyService(SupplierModel, {
        userEmail,
        email: req.body.email,
      });
      if (supplier) throw customError("email address already exits", 400);
    }
    // checking mobile exits or not
    if (req.body.mobile) {
      const supplier = await findByPropertyService(SupplierModel, {
        userEmail,
        mobile: req.body.mobile,
      });
      if (supplier) throw customError("mobile already exits", 400);
    }

    const result = await updateService(
      SupplierModel,
      { _id: id, userEmail },
      { ...req.body }
    );
    if (!result) throw customError("invalid id", 400);
    // every think is ok now response to client
    res.status(200).json({
      message: "supplier update successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const supplierList = async (req, res, next) => {
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
      SupplierModel,
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

const supplierDropDown = async (req, res, next) => {
  try {
    const { email } = req.headers;

    const query = { userEmail: email };
    const projection = { name: 1 };

    const data = await dropDownService(SupplierModel, query, projection);

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
  createSupplier,
  updateSupplier,
  supplierList,
  supplierDropDown,
};
