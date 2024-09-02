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

  publishProductByShop = async (req, res) => {
    new SuccessResponse({
      message: "Publish product success!!",
      metadata: await ProductServiceV2.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res) => {
    new SuccessResponse({
      message: "Un-publish product success!!",
      metadata: await ProductServiceV2.unPublishProductByShop({
        product_id: req.params.id,
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
  getAllDraftsForShop = async (req, res) => {
    new SuccessResponse({
      message: "Get list drafts success!!",
      metadata: await ProductServiceV2.findAllDraftForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  // END QUERY //

  getAllPublishForShop = async (req, res) => {
    new SuccessResponse({
      message: "Get list publish success!!",
      metadata: await ProductServiceV2.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res) => {
    new SuccessResponse({
      message: "Get list getListSearchProduct success!!",
      metadata: await ProductServiceV2.searchProducts(req.params),
    }).send(res);
  };
}

module.exports = new ProductController();
