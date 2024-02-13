const { default: mongoose } = require("mongoose");
const SupplierModel = require("../../models/supplier/supplierModel");
const createService = require("../../services/common/createService");
const dropDownService = require("../../services/common/dropDownService");
const listService = require("../../services/common/listService");
const updateService = require("../../services/common/updateService");
const customError = require("../../utilities/customError");
const checkAssociateService = require("../../services/common/checkAssociateService");
const PurchaseModel = require("../../models/purchase/PurchaseModel");
const deleteService = require("../../services/common/deleteService");
const findByPropertyService = require("../../services/common/findByPropertyService");

const createSupplier = async (req, res, next) => {
  try {
    const { name, email, address, mobile } = req.body;
    const userEmail = req.headers?.email;

    // validation
    if (!name) throw customError("supplier name required", 400);
    if (!email) throw customError("supplier email required", 400);
    if (!address) throw customError("supplier address required", 400);
    if (!mobile) throw customError("supplier mobile required", 400);

    // now crate a new supplier
    const supplier = await createService(SupplierModel, {
      userEmail,
      name,
      email,
      address,
      mobile,
    });

    // every think is ok now response to client
    res.status(200).json({
      message: "supplier create successfully",
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

const supplierDetailsById = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const userEmail = req.headers?.email;

    // validation
    if (!_id) throw customError("supplier _id required", 400);

    const query = { _id, userEmail };
    const result = await findByPropertyService(SupplierModel, query);

    if (!result) throw customError("supplier not found", 404);

    // every think is ok now response to client
    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userEmail = req.headers?.email;

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

const deleteSupplier = async (req, res, next) => {
  try {
    const { email } = req.headers;
    const { _id } = req.params;

    // search associate model
    const query = { supplierId: new mongoose.Types.ObjectId(_id) };
    const isExist = await checkAssociateService(PurchaseModel, query);
    if (isExist) throw customError("suppler associate in purchase", 400);

    // now delete process
    const result = await deleteService(SupplierModel, {
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
  createSupplier,
  supplierDetailsById,
  updateSupplier,
  supplierList,
  supplierDropDown,
  deleteSupplier,
};
