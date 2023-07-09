const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailError } = require('../core/error.response')
const keyTokenService = require('../services/keyToken.service')

const createTokenPair = async (payload, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })
        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })
        return { accessToken, refreshToken }
    } catch (error) {
        console.log("==error==", error)
        return null
    }
}

const verify = async ({ token, publicKey }) => {
    try {
        const decode = await JWT.verify(token, publicKey, (error, decode) => {
            console.log("==Decode==", decode)
        })
    } catch (error) {

    }
}

const authenticate = asyncHandler(async (req, res, next) => {
    console.log("==req.headers==", req.headers)
    const userId = req.headers["user-id"]
    if (!userId) throw new AuthFailError()
    const userToken = await keyTokenService.findByUserId(userId)
    if (!userToken) throw new AuthFailError("Not found user")

    const accessToken = req.headers.token;
    if (!accessToken) throw new AuthFailError("Not found token")

    const decodeUser = await JWT.decode(accessToken, userToken.publicKey);
    console.log("==decodeUser==", decodeUser)
    if (decodeUser.userId !== userId) throw new AuthFailError("Authenticate fail!")
    req.keyStore = userToken
    req.shopId = userId
    return next()
})

module.exports = {
    createTokenPair,
    verify,
    authenticate,
}