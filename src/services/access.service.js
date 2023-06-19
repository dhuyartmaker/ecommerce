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
        const findShop = await shopService.findByEmail({ email, select: { password: 1 }})
        if (!findShop) throw new BadRequestError("Shop isn't registered!");

        const comparePassword = bcrypt.compare(password, findShop.password)
        if (!comparePassword) throw new AuthFailError();

        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
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

        const tokens = await createTokenPair({ userId: findShop._id, email}, privateKey)
        await keyTokenService.createToken({
            userId: findShop._id,
            publicKey,
            refreshToken: tokens.refreshToken
        })
        return {
            shop: await shopService.findByEmail({ email }),
            tokens
        }
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
            const tokens = await createTokenPair({ userId: createShop._id, email}, privateKey)

            const publicKeyString = await keyTokenService.createToken({
                userId: createShop._id,
                publicKey,
                refreshToken: tokens.refreshToken
            })
            // const publicKeyObject = crypto.createPublicKey(publicKeyString)

            console.log("==tokens==", tokens)
            return {
                shop: await shopService.findByEmail({ email }),
                tokens,
            }
        }

        return null
    }

    signOut = async (keyStore) => {
        const deleteKeyStore = await keyTokenService.removeById(keyStore._id)
        return deleteKeyStore;
    }
}

module.exports = new AccessService()