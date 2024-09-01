"use strict";

const {
  product,
  electronic,
  furniture,
  clothing,
} = require("../product.model");

const { Types } = require("mongoose");

// Mục đích của repository dung de lam nhung~ queries đơn giản nhưng dùng tần suất nhiều lần cho service class.
const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublish = true;

  const { modifiedCount } = await foundShop.update(foundShop); //update thanh cong thi modifedCount = 1; otherwise = 0
  return modifiedCount;
};

module.exports = { findAllDraftForShop, publishProductByShop };
