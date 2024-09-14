"use strict";

const { model, Schema } = require("mongoose");
const slugify = require("slugify");
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema(
  {
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /*
     *  order_checkout = [
     *     totalPrice,
     *     totalApplyDiscount,
     *     feeShip
     * ~ checkout_order
     * */
    order_shipping: { type: Object, default: {} },
    /*
     *     street
     *     city,
     *     state,
     *     country
     * */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true }, // shop_order_ids_new
    order_trackingNumber: { type: String, default: "#00001" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
      default: "pending",
    },
  },
  {
    // timestamps: true,
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  },
);

module.exports = {
  inventory: model(DOCUMENT_NAME, orderSchema),
};
