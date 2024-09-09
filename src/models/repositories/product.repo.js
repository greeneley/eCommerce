"use strict";

const {
  product,
  electronic,
  furniture,
  clothing,
} = require("../product.model");

const { getSelectData, unGetSelectData } = require("../../utils/index");
const { Types } = require("mongoose");
const { convertToObjectIdMongodb } = require("../../utils");

// Mục đích của repository dung de lam nhung~ queries đơn giản nhưng dùng tần suất nhiều lần cho service class.
const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};
const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  return await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } },
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  return product.findById(product_id).select(unGetSelectData(unSelect));
};

const updateProductById = async (
  productId,
  bodyUpdate,
  model,
  isNew = true,
) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew,
  });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop); //update thanh cong thi modifedCount = 1; otherwise = 0
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop); //update thanh cong thi modifedCount = 1; otherwise = 0
  return modifiedCount;
};

const getProductById = async (productId) => {
  return await product
    .findOne({ _id: convertToObjectIdMongodb(productId) })
    .lean();
};

module.exports = {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
};
