const { RoleShop } = require("../config/constant");
const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtil");
const { ConflictRequestError, BadRequestError, AuthFailError } = require("../core/error.response");
const shopService = require("./shop.service");

class AccessService {
    signIn = async ({ email, password, refreshToken = "" }) => {
        const findShop = await shopService.findByEmail({ email })
        if (!findShop) throw new BadRequestError("Shop isn't registered!");

        const comparePassword = bcrypt.compare(password, findShop.password)
        if (!comparePassword) throw new AuthFailError()
    }

    signUp = async (payload) => {
        const { email, name, password } = payload;
        const existsShop = await shopModel.findOne({
            email: payload.email
        })
        if (existsShop) {
            throw new ConflictRequestError("Email exists!")
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const createShop = await shopModel.create({
            email,
            name,
            password: passwordHash,
            roles: RoleShop.SHOP
        })

        console.log("==createShop==", createShop)

        if (createShop) {
            const { publicKey, privateKey } = await crypto.generateKeyPairSync("rsa", {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                }
            })

            console.log("==public==", publicKey)
            console.log("==privateKey==", privateKey)

            const publicKeyString = await keyTokenService.createToken({
                userId: createShop._id,
                publicKey,
            })

            if (!publicKeyString) {
                return {
                    message: "Error"
                }
            }
            const publicKeyObject = crypto.createPublicKey(publicKeyString)
            console.log("===publicKeyString===", publicKeyObject)
            const tokens = await createTokenPair({ userId: createShop._id, email}, privateKey)
            console.log("==tokens==", tokens)
            return tokens
        }

        return null
    }
}

module.exports = new AccessService()