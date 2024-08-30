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
}

module.exports = new ProductController();
