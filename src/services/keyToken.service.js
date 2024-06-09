'use strict'

const keyTokenModel = require("../models/keytoken.model")
const {Types} = require("mongoose");


class KeyTokenService {
    static createToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // level 0
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            // return tokens ? tokens.publicKey : null;

            // level xxx
            const filter = {user: userId},
                update = {publicKey, privateKey, refreshTokenUsed: [], refreshToken},
                options = {upsert: true, new: true}
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null
        } catch (error) {

            return error;
        }
    }

    static findByUserId = async (userId) => {
        return keyTokenModel.findOne({user: new Types.ObjectId(userId)}).lean();
    }

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne(id);
    }
    
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshTokenUsed: refreshToken}).lean();
    }

    static findByRefresh = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshToken})
    }

    static deleteKeyById = async (userId) => {
        return await keyTokenModel.findOneAndDelete({user: new Types.ObjectId(userId)})
    }
}


module.exports = KeyTokenService;