/* eslint-disable no-param-reassign */

const ReturnModel = require("../../models/return/ReturnModel");
const ReturnProductModel = require("../../models/return/ReturnProductModel");
const createParentChildService = require("../../services/common/createParentChildService");
const deleteParentChildService = require("../../services/common/deleteParentChildService");
const listOneJoinService = require("../../services/common/listOneJoinService");
const customError = require("../../utilities/customError");

const createReturn = async (req, res, next) => {
  try {
    const { parentData } = req.body;
    const { childData } = req.body;
    const userEmail = req.headers.email;

    // validation
    if (!req.body) {
      throw customError("invalid request", 400);
    }

    if (typeof parentData !== "object") {
      throw customError("invalid request", 400);
    }

    if (!(childData instanceof Array)) {
      throw customError("invalid request", 400);
    }

    // inject logged in user email
    parentData.userEmail = userEmail;
    childData.forEach((obj) => {
      obj.userEmail = userEmail;
    });

    // now crate a new return
    const result = await createParentChildService(
      ReturnModel,
      ReturnProductModel,
      parentData,
      childData,
      "returnId"
    );

    if (!result) {
      throw customError("transaction roll back error", 400);
    } else {
      res.status(200).json({
        message: "return create successfully",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

const returnList = async (req, res, next) => {
  try {
    const pageNo = Number(req.query.pageNo) || 1;
    const perPage = Number(req.query.perPage) || 5;
    const { searchValue } = req.query;
    const { email } = req.headers;
    const queryExp = {
      $or: [
        { notes: { $regex: searchValue, $options: "i" } },
        { "customer.name": { $regex: searchValue, $options: "i" } },
        { "customer.email": { $regex: searchValue, $options: "i" } },
        { "customer.mobile": { $regex: searchValue, $options: "i" } },
      ],
    };
    const SearchQuery = searchValue ? queryExp : "";
    const query = { userEmail: email };
    const JoinStage = {
      $lookup: {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customer",
      },
    };

    const data = await listOneJoinService(
      ReturnModel,
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
const deleteReturn = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { email } = req.headers;
    if (!_id) throw customError("invalid id", 400);

    // now delete process
    const result = await deleteParentChildService(
      ReturnModel,
      ReturnProductModel,
      _id,
      email,
      "returnId"
    );

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

module.exports = { createReturn, returnList, deleteReturn };
