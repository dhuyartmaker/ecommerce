const mongoose = require("mongoose");
const { RoleShop } = require("../config/constant");
const keytokenModel = require("../models/keytoken.model");
const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class KeyTokenService {
    createToken = async ({ userId , publicKey, refreshToken }) => {
        try {
            const publicKeyString = await publicKey.toString();
            const createToken = await keytokenModel.findOneAndUpdate({
                user: userId
            },{
                publicKey: publicKeyString,
                $push: { refreshTokenUsed: refreshToken },
                refreshToken,
            }, {
                upsert: true,
                new: true
            })
            return createToken ? createToken.publicKey : null
        } catch (error) {
            console.log("Error:", error)
            return null
        }
    }

    findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: userId }).lean()
    }

    removeById = async (_id) => {
        return await keytokenModel.deleteOne({ _id })
    }
}

module.exports = new KeyTokenService()