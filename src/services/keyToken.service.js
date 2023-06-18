const { RoleShop } = require("../config/constant");
const keytokenModel = require("../models/keytoken.model");
const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class KeyTokenService {
    createToken = async ({ userId , publicKey }) => {
        try {
            const publicKeyString = await publicKey.toString();
            const createToken = await keytokenModel.create({
                user: userId,
                publicKey: publicKeyString
            })
            return createToken ? createToken.publicKey : null
        } catch (error) {
            console.log("Error:", error)
            return null
        }
    }
}

module.exports = new KeyTokenService()