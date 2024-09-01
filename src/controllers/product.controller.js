"use strict";

const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.v2");
const { SuccessResponse } = require("../core/success.response");

class ProductController {
  createProduct = async (req, res) => {
    // new SuccessResponse({
    //   message: "Create new product success!!",
    //   metadata: await ProductService.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId,
    //   }),
    // }).send(res);

    new SuccessResponse({
      message: "Create new product success!!",
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  // QUERY //
  /**
   * @desc Get all drafts for shop
   * @param (Number) limit
   * @return {JSON}
   * */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list drafts success!!",
      metadata: await ProductServiceV2.findAllDraftForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  // END QUERY //
}

module.exports = new ProductController();
