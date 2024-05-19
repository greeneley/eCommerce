'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const {createTokenPair} = require("../auth/authUtils");
const {getInfoData} = require('../utils')
const {BadRequestError} = require("../core/error.response");


const RoleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({name, email, password}) => {

        // step 1 check exist email
        const holderShop = await shopModel.findOne({email}).lean();

        if (holderShop) {
            throw new BadRequestError('Error: Shop already registered!');
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

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

            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            console.log({privateKey, publicKey}); // save Collection KeyStore

            // Save public Key trong database
            const keyStore = await KeyTokenService.createToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })

            if (!keyStore) {
                throw new BadRequestError('publicKeyString error!')
            }

            // const tokens = await
            // created token pair dua vao publicKeyString (chua refresh token)
            const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)

            console.log(`Created token Successs:::`, tokens);
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                    tokens
                }
            }

        }

        return {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessService;