"use strict";

const cart = require("../cart.model");
const { convertToObjectIdMongodb } = require("../../utils");
const { getProductById } = require("./product.repo");
const { product } = require("../product.model");

const findCartById = async (cartId) => {
  return await cart.findById({
    _id: convertToObjectIdMongodb(cartId),
    cart_state: "active",
  });
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (productItem) => {
      const foundProduct = await product.findById({
        _id: convertToObjectIdMongodb(productItem.product_id),
      });

      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: productItem.quantity,
          productId: productItem.product_id,
        };
      }
    }),
  );
};

module.exports = {
  findCartById,
  checkProductByServer,
};
