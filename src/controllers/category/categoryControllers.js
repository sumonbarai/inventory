const { default: mongoose } = require("mongoose");
const CategoryModel = require("../../models/category/CategoryModel");
const checkAssociateService = require("../../services/common/checkAssociateService");
const createService = require("../../services/common/createService");
const dropDownService = require("../../services/common/dropDownService");
const findByPropertyService = require("../../services/common/findByPropertyService");
const listService = require("../../services/common/listService");
const updateService = require("../../services/common/updateService");
const customError = require("../../utilities/customError");
const ProductModel = require("../../models/product/ProductModel");
const deleteService = require("../../services/common/deleteService");

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userEmail = req.headers?.email;

    // validation
    if (!name) throw customError("Category name required", 400);

    // checking already create same category
    const query = { userEmail, name };
    const isExist = await findByPropertyService(CategoryModel, query);
    if (isExist) throw customError("Category name already exits", 400);

    // now crate a new Category
    const brand = await createService(CategoryModel, { userEmail, name });

    // every think is ok now response to client
    res.status(200).json({
      message: "Category create successfully",
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const userEmail = req.headers?.email;

    // validation
    if (!name) throw customError("category name required", 400);
    if (!id) throw customError("category id required", 400);

    const query = { _id: id, userEmail, name };

    // checking Category exits or not
    const isExist = await findByPropertyService(CategoryModel, query);
    if (isExist) throw customError("Category name already exist", 400);

    const result = await updateService(
      CategoryModel,
      { _id: id, userEmail },
      { name }
    );
    if (!result) throw customError("invalid id", 400);

    // every think is ok now response to client
    res.status(200).json({
      message: "Category update successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const categoryList = async (req, res, next) => {
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
      CategoryModel,
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

const categoryDropDown = async (req, res, next) => {
  try {
    const { email } = req.headers;

    const query = { userEmail: email };
    const projection = { name: 1, _id: 0 };

    const data = await dropDownService(CategoryModel, query, projection);

    // every think is ok now response to client
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { email } = req.headers;
    const { _id } = req.params;

    // search associate model
    const query = { categoryId: new mongoose.Types.ObjectId(_id) };
    const isExist = await checkAssociateService(ProductModel, query);
    if (isExist) throw customError("category associate in product", 400);

    // now delete process
    const result = await deleteService(CategoryModel, {
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
  createCategory,
  updateCategory,
  categoryList,
  categoryDropDown,
  deleteCategory,
};
