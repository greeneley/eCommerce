'use strict'

const shopModel = require("../models/shop.model")
const bycrypt = require('bycrypt');
const crypto = require('crypto');

const RoleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            // step 1 check exist email
            const holderShop = await shopModel.findOne({email}).lean();

            if (holderShop) {
                return {
                    code: 'xxx',
                    message: "Shop already register!"
                }
            }
            
            const passwordHash = await bycrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })
            
            if (newShop) {
                // create privateKey, publicKey
                const { privateKey, publicKey } =  crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096
                })

                console.log({privateKey, publicKey}); // save Collection KeyStore
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService;