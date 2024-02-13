const { default: mongoose } = require("mongoose");
const ProductModel = require("../../models/product/ProductModel");
const createService = require("../../services/common/createService");
const dropDownService = require("../../services/common/dropDownService");
const listTwoJoinService = require("../../services/common/listTwoJoinService");
const updateService = require("../../services/common/updateService");
const customError = require("../../utilities/customError");
const checkAssociateService = require("../../services/common/checkAssociateService");
const deleteService = require("../../services/common/deleteService");
const PurchaseProductModel = require("../../models/purchase/PurchaseProductModel");
const salesProductModel = require("../../models/sales/SalesProductModel");
const ReturnProductModel = require("../../models/return/ReturnProductModel");
const findByPropertyService = require("../../services/common/findByPropertyService");

const createProduct = async (req, res, next) => {
  try {
    const { name, brandId, categoryId, details, unit } = req.body;
    const userEmail = req.headers?.email;

    // validation
    if (!name) throw customError("product name required", 400);
    if (!brandId) throw customError("product Brand id required", 400);
    if (!categoryId) throw customError("product category id required", 400);
    if (!details) throw customError("product details required", 400);
    if (!unit) throw customError("product unit required", 400);

    // now crate a new expense
    const result = await createService(ProductModel, {
      ...req.body,
      userEmail,
    });

    // every think is ok now response to client
    res.status(200).json({
      message: "product create successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const productDetailsById = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const userEmail = req.headers?.email;

    // validation
    if (!_id) throw customError("product _id required", 400);

    const query = { _id, userEmail };
    const result = await findByPropertyService(ProductModel, query);

    if (!result) throw customError("product not found", 404);

    // every think is ok now response to client
    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userEmail = req.headers?.email;
    const reqBody = req.body;
    delete reqBody.userEmail;

    // validation
    if (!id) throw customError("product id required", 400);

    const result = await updateService(
      ProductModel,
      { _id: id, userEmail },
      { ...reqBody }
    );
    if (!result) throw customError("invalid id", 400);

    // every think is ok now response to client
    res.status(200).json({
      message: "product update successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const ProductList = async (req, res, next) => {
  try {
    const pageNo = Number(req.query.pageNo) || 1;
    const perPage = Number(req.query.perPage) || 5;
    const { searchValue } = req.query;
    const { email } = req.headers;
    const queryExp = {
      $or: [
        { name: { $regex: searchValue, $options: "i" } },
        { details: { $regex: searchValue, $options: "i" } },
        { unit: { $regex: searchValue, $options: "i" } },
        { "brand.name": { $regex: searchValue, $options: "i" } },
        { "category.name": { $regex: searchValue, $options: "i" } },
      ],
    };
    const SearchQuery = searchValue ? queryExp : "";
    const query = { userEmail: email };
    const JoinStage1 = {
      $lookup: {
        from: "brands",
        localField: "brandId",
        foreignField: "_id",
        as: "brand",
      },
    };
    const JoinStage2 = {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    };

    const data = await listTwoJoinService(
      ProductModel,
      pageNo,
      perPage,
      query,
      SearchQuery,
      JoinStage1,
      JoinStage2
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

const ProductDropDown = async (req, res, next) => {
  try {
    const { email } = req.headers;

    const query = { userEmail: email };
    const projection = { name: 1 };

    const data = await dropDownService(ProductModel, query, projection);

    // every think is ok now response to client
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { email } = req.headers;
    const { _id } = req.params;

    // search associate model
    const query = { productId: new mongoose.Types.ObjectId(_id) };

    {
      const isExist = await checkAssociateService(PurchaseProductModel, query);
      if (isExist) throw customError("product associate in purchase", 400);
    }

    {
      const isExist = await checkAssociateService(salesProductModel, query);
      if (isExist) throw customError("product associate in sales", 400);
    }

    {
      const isExist = await checkAssociateService(ReturnProductModel, query);
      if (isExist) throw customError("product associate in return", 400);
    }

    // now delete process
    const result = await deleteService(ProductModel, {
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
  createProduct,
  productDetailsById,
  updateProduct,
  ProductList,
  ProductDropDown,
  deleteProduct,
};
