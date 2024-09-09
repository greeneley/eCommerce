"use strict";

const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  addToCart = async (req, res) => {
    new SuccessResponse({
      message: "Create new cart success",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  // update + - quantity
  update = async (req, res) => {
    new SuccessResponse({
      message: "Create new cart success",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  delete = async (req, res) => {
    new SuccessResponse({
      message: "Delete Item In Cart success",
      metadata: await CartService.deleteItemInCart(req.body),
    }).send(res);
  };

  listToCart = async (req, res) => {
    new SuccessResponse({
      message: "List Cart success",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
