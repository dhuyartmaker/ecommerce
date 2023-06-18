const JWT = require('jsonwebtoken')

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

module.exports = {
    createTokenPair,
    verify,
}