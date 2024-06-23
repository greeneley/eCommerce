``"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITE: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  /*
    Check this token used ?
     */
  static handlerRefreshToken = async (refreshToken) => {
    const foundToken =
      await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    if (foundToken) {
      // decode xem refreshtoken la ai
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey,
      );
      console.log({ userId, email });

      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Please login agains");
    }

    const holderToken = await KeyTokenService.findByRefresh(refreshToken);

    if (!holderToken)
      throw new AuthFailureError("holderToken::: Shop not registered");

    // Verify Token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey,
    );
    console.log("[2] --- ", { userId, email });

    const foundShop = await findByEmail({ email });

    if (!foundShop)
      throw new AuthFailureError("foundShop::: Shop not registered");

    // Create 1 cap moi
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey,
    );

    // update token

    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken, // da duoc su dung de lay token moi roi
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log({ delKey });
    return delKey;
  };

  /*
        1 - check email in dbs
        2 - match password 
        3 - create AT and RF and save
        4 - generate token
        5 - get data return login
     */
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });

    if (!foundShop) throw new BadRequestError("Shop not registered");

    //2.
    const match = bcrypt.compare(password, foundShop.password);

    if (!match) throw new AuthFailureError("Authentication error");

    //3.
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundShop;

    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey,
    );

    await KeyTokenService.createToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // step 1 check exist email
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered!");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // create privateKey, publicKey
      // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
      //     modulusLength: 4096,
      //     publicKeyEncoding: {
      //         type: 'pkcs1',
      //         format: 'pem'
      //     },
      //     privateKeyEncoding: {
      //         type: 'pkcs1',
      //         format: 'pem'
      //     }
      //
      // })

      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log({ privateKey, publicKey }); // save Collection KeyStore

      // Save public Key trong database
      const keyStore = await KeyTokenService.createToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("publicKeyString error!");
      }

      // const tokens = await
      // created token pair dua vao publicKeyString (chua refresh token)
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey,
      );

      console.log(`Created token Successs:::`, tokens);
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
