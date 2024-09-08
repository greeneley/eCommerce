"use strict";

const DiscountService = require("../services/discount.service");
const { SuccessResponse } = require("../core/success.response");

class DiscountController {
  createDiscountCode = async (req, res) => {
    new SuccessResponse({
      message: "Successful Code generation!!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  updateDiscountCode = async (req, res) => {
    new SuccessResponse({
      message: "Update successfully discount code !!",
      metadata: await DiscountService.updateDiscountCode({
        ...req.body,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res) => {
    new SuccessResponse({
      message: "Successfully code found!!",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  getAllDiscountCodesWithProducts = async (req, res) => {
    new SuccessResponse({
      message: "Successfully code found!!",
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res);
  };

  getAllDiscountCodesByShop = async (req, res) => {
    new SuccessResponse({
      message: "Successfully code found!!",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
      }),
    }).send(res);
  };

  deleteDiscountCodeByShop = async (req, res) => {
    new SuccessResponse({
      message: "Successfully code found!!",
      metadata: await DiscountService.deleteDiscountCodeByShop({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
