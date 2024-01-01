const BrandModel = require("../../models/brand/BrandModel");
const createService = require("../../services/common/createService");
const dropDownService = require("../../services/common/dropDownService");
const findByPropertyService = require("../../services/common/findByPropertyService");
const listService = require("../../services/common/listService");

const updateService = require("../../services/common/updateService");
const customError = require("../../utilities/customError");

const createBrand = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userEmail = req.headers?.email;

    // validation
    if (!name) throw customError("brand name required", 400);

    // checking already create same brand
    const query = { userEmail, name };
    const isExist = await findByPropertyService(BrandModel, query);
    if (isExist) throw customError("brand name already exits", 400);

    // now crate a new brand
    const brand = await createService(BrandModel, { userEmail, name });

    // every think is ok now response to client
    res.status(200).json({
      message: "brand create successfully",
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

const updateBrand = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const userEmail = req.headers?.email;

    // validation
    if (!name) throw customError("brand name required", 400);
    if (!id) throw customError("brand id required", 400);

    const query = { _id: id, userEmail, name };

    // checking brand exits or not
    const isExist = await findByPropertyService(BrandModel, query);
    if (isExist) throw customError("Brand name already exist", 400);

    const result = await updateService(
      BrandModel,
      { _id: id, userEmail },
      { name }
    );
    if (!result) throw customError("invalid id", 400);

    // every think is ok now response to client
    res.status(200).json({
      message: "brand update successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const brandList = async (req, res, next) => {
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
      BrandModel,
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

const brandDropDown = async (req, res, next) => {
  try {
    const { email } = req.headers;

    const query = { userEmail: email };
    const projection = { name: 1, _id: 0 };

    const data = await dropDownService(BrandModel, query, projection);

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
  createBrand,
  updateBrand,
  brandList,
  brandDropDown,
};
