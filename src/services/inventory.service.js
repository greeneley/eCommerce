"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { inventory } = require("../models/inventory.model");
const { convertToObjectIdMongodb } = require("../utils");
const {
  checkProductByServer,
  findCartById,
} = require("../models/repositories/cart.repo");

const { getProductById } = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "132, Tran phu, HCM city",
  }) {
    const product = await getProductById(productId);
    if (!product) throw new BadRequestError("The product does not exists!!!");

    const query = { inven_shopId: shopId, inven_productId: productId },
      updateSet = {
        $inc: {
          inven_stock: stock,
        },
        $set: {
          inven_location: location,
        },
      },
      options = { upsert: true, new: true };
    return await inventory.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
