"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { inventory } = require("../models/inventory.model");
const { convertToObjectIdMongodb } = require("../utils");
const {
  checkProductByServer,
  findCartById,
} = require("../models/repositories/cart.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

class InventoryService {}

module.exports = InventoryService;
