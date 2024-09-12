"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const cart = require("../models/cart.model");
const { convertToObjectIdMongodb } = require("../utils");
const { Schema } = require("mongoose");
const { getProductById } = require("../models/repositories/product.repo");
const {
  checkProductByServer,
  findCartById,
} = require("../models/repositories/cart.repo");
const { getDiscountAmount } = require("./discount.service");

class CheckoutService {
  // login and without login
  //
  /* 
    {
      cartId,
      userId,
      shop_order_ids: [
        {
          shopId,
          shop_discount: []
          item_products: [{
              price,
              quantity,
              productId
            }],
       },
          {
          shopId,
          shop_discounts: [{
          
            shopId,
            discountId,
            codeId
          ]
          item_products: [{
              price,
              quantity,
              productId
            }],
       },  
  
   */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // check cartId ton tai hay khong ?

    const foundCart = await findCartById(cartId);

    if (!foundCart) throw new BadRequestError("Cart does not exist");

    const checkout_order = {
        totalPrice: 0, // tong tien hang
        feeShip: 0, // phi van chuyen
        totalDiscount: 0, // tong tien discount giam gia
        totalCheckout: 0, // tong thanh toan cuoi cung
      },
      shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      const checkProductServer = await checkProductByServer(item_products);

      console.log({ checkProductServer });

      if (!checkProductServer[0]) throw new BadRequestError("Order wrong !!!");

      // tong tien don hang sau khi xu ly
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      // tong tien truoc khi xu ly

      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tong tien truoc khi giam gia,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      // Neu shop_discounts.length > 0 , check xem co hop le hay hok

      if (shop_discounts.length > 0) {
        // gia su chi co 1 discount
        // get amount
        const { discount = 0, totalPrice = 0 } = await getDiscountAmount({
          code: shop_discounts[0].codeId,
          userId: userId,
          shopId: shopId,
          products: checkProductServer,
        });

        // tong cong discount giam gia
        checkout_order.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      // tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;

      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }
}

module.exports = CheckoutService;
