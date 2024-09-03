"use strict";

const { model, Schema } = require("mongoose");
const slugify = require("slugify");
const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const inventorySchema = new Schema(
  {
    inven_productId: { type: Schema.Types.ObjectId, ref: "Product" },
    inven_location: { type: String, default: "unknown" },
    inven_stock: { type: Number, required: true },
    inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    inven_reservations: { type: Array, default: [] }, // Khi nguoi dung dat 1 san pham, viec luu tru reservervation giup client co the dat dc san pham trg hang ton kho
    // TRONG SHOPPEE, khi mua hang xong, no chua tru lien trong hang ton kho; amz thi tru ngay lap tuc
    /*
            cartId: ,
            stock: 1,
            createdOn: 
           */
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

module.exports = {
  inventory: model(DOCUMENT_NAME, inventorySchema),
};
