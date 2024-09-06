"use strict";

/*
 * Discount service
 * 1 - Generator Discount Code [Shop | Admin]
 * 2 - Get discount amount [User]
 * 3 - Get All discount codes [User]
 * 4 - Verify discount code [User]
 * 5 - Delete discount code [admin]
 * 6 - Cancel discount code [user]
 * */

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discount = require("../models/discount.model");
const { convertToObjectIdMongodb } = require("../utils");
const { Schema } = require("mongoose");
const { findAllProducts } = require("../models/repositories/product.repo");
const {
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
} = require("../models/repositories/discount.repo");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_uses,
      uses_count,
      uses_used,
      max_uses_per_user,
    } = payload;
    // kiem tra

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code has expired");
    }

    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError("Start date must be before end date");
    }
    // create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exists");
    }

    return await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type, // percentage
      discount_value: value, // 10.000, 10
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses, // so luong discount dc ap dung
      discount_uses_count: uses_count, // so discount da su dung
      discount_users_used: uses_used, // user nao da su dung
      discount_max_uses_per_user: max_uses_per_user, // so luong cho phep toi da su dung moi user
      discount_min_order_value: min_order_value, // gia tri don hang toi thieu
      discount_shopId: convertToObjectIdMongodb(shopId),
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids, // so san pham duoc ap dung
    });
  }

  static async updateDiscountCode(payload) {
    const { discount_name } = payload;

    return await discount.findByIdAndUpdate(discount_name, payload, {
      new: isNew,
    });
  }

  /*
   * Get all discount codes [user]
   * */
  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exists!");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      //get all products

      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      // get the product ids
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: shopId,
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
      model: discount,
    });
    return discounts;
  }
}
