"use strict";

const express = require("express");
const discountController = require("../../controllers/discount.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const router = express.Router();

router.post("/amount", asyncHandler(discountController.getDiscountAmount));
router.post(
  "/list-product-code",
  asyncHandler(discountController.getAllDiscountCodesWithProducts),
);

// authentication
router.use(authentication);

router.post("", asyncHandler(discountController.createDiscountCode));
router.get(
  "",
  asyncHandler(discountController.getAllDiscountCodesWithProducts),
);

module.exports = router;
