/* eslint-disable no-param-reassign */
const PurchaseModel = require("../../models/purchase/PurchaseModel");
const PurchaseProductModel = require("../../models/purchase/PurchaseProductModel");
const createParentChildService = require("../../services/common/createParentChildService");
const listOneJoinService = require("../../services/common/listOneJoinService");
const customError = require("../../utilities/customError");

const createPurchase = async (req, res, next) => {
  try {
    const { parentData } = req.body;
    const { childData } = req.body;
    const userEmail = req.headers.email;

    // validation
    if (!req.body) {
      throw customError("invalid required", 400);
    }

    if (typeof parentData !== "object") {
      throw customError("invalid required", 400);
    }

    if (!(childData instanceof Array)) {
      throw customError("invalid required", 400);
    }

    // inject logged in user email
    parentData.userEmail = userEmail;
    childData.forEach((obj) => {
      obj.userEmail = userEmail;
    });

    // now crate a new purchase
    const result = await createParentChildService(
      PurchaseModel,
      PurchaseProductModel,
      parentData,
      childData,
      "purchaseId"
    );

    if (!result) {
      throw customError("transaction roll back error", 400);
    } else {
      res.status(200).json({
        message: "purchase create successfully",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};
const PurchaseList = async (req, res, next) => {
  try {
    const pageNo = Number(req.query.pageNo) || 1;
    const perPage = Number(req.query.perPage) || 5;
    const { searchValue } = req.query;
    const { email } = req.headers;
    const queryExp = {
      $or: [
        { notes: { $regex: searchValue, $options: "i" } },
        { "supplier.name": { $regex: searchValue, $options: "i" } },
        { "supplier.email": { $regex: searchValue, $options: "i" } },
        { "supplier.mobile": { $regex: searchValue, $options: "i" } },
      ],
    };
    const SearchQuery = searchValue ? queryExp : "";
    const query = { userEmail: email };
    const JoinStage = {
      $lookup: {
        from: "suppliers",
        localField: "supplierId",
        foreignField: "_id",
        as: "supplier",
      },
    };

    const data = await listOneJoinService(
      PurchaseModel,
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

module.exports = { createPurchase, PurchaseList };
