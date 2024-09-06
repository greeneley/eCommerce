"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === null) {
      delete obj[k];
    }
  });

  return obj;
};

const updatedNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if ([null, undefined].includes(obj[k])) return;
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updatedNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);
module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updatedNestedObjectParser,
  convertToObjectIdMongodb,
};
