"use strict";

/*
    Key feature cart service
    - Add product to cart [user]
    - increase/reduce product quantity by one [user]
    - get cart [user]
    - delete cart [user]
    - delete cart item [user] 
 */

const { BadRequestError, NotFoundError } = require("../core/error.response");
const cart = require("../models/cart.model");
const { convertToObjectIdMongodb } = require("../utils");
const { Schema } = require("mongoose");

class CartService {
  // START REPO

  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateSet, options);
  }

  static async addToCart({ userId, product = {} }) {
    // check cart exist ?
    const userCart = await cart.findOne({
      cart_userId: userId,
    });

    if (!userCart) {
      //create cart for user
      return await CartService.createUserCart({ userId, product });
    }

    // neu co gio hang roi nhung chua co  san pham

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // gio hang ton tai, va co san pham nay thi update quantity
    return await CartService.updateUserCartQuantity({ userId, product });
  }
}

module.exports = new CartService();
